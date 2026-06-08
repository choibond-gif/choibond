import { NextRequest } from "next/server";

const NAVER_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_SECRET = process.env.NAVER_CLIENT_SECRET!;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

async function fetchNaverNews(company: string) {
  const query = encodeURIComponent(`${company} 신용 재무 채권`);
  const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=5&sort=date`;

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": NAVER_ID,
      "X-Naver-Client-Secret": NAVER_SECRET,
    },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.items ?? []).map((item: NaverItem) => ({
    title: item.title.replace(/<[^>]+>/g, ""),
    link: item.link,
    description: item.description.replace(/<[^>]+>/g, ""),
    pubDate: item.pubDate,
  }));
}

async function summarizeWithGemini(company: string, articles: NaverNews[]) {
  if (!GEMINI_KEY || articles.length === 0) {
    return articles.length === 0
      ? "관련 뉴스 없음"
      : articles.map((a) => a.title).join(" / ");
  }

  const newsText = articles
    .map((a, i) => `${i + 1}. ${a.title}: ${a.description}`)
    .join("\n");

  const prompt = `채권 운용 담당자 관점에서 아래 ${company}의 최신 뉴스를 신용 리스크 측면으로 2-3문장 요약해줘.
신용등급 변화, 재무건전성, 유동성, 업황 영향 중심으로 작성. 핵심 리스크/기회 요인 포함. 한국어로 답변.

뉴스:
${newsText}

요약:`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.3 },
      }),
    }
  );

  if (!res.ok) {
    console.error("Gemini error:", await res.text());
    return articles.map((a) => a.title).join(" / ");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    ?? articles.map((a) => a.title).join(" / ");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company");

  if (!company)
    return Response.json({ error: "company 파라미터 필요" }, { status: 400 });

  const articles = await fetchNaverNews(company);
  const summary = await summarizeWithGemini(company, articles);

  return Response.json({
    company,
    summary,
    articles,
    hasAI: !!GEMINI_KEY,
  });
}

// 여러 기업 일괄 조회
export async function POST(req: NextRequest) {
  const body = await req.json();
  const companies: string[] = body.companies ?? [];

  if (companies.length === 0)
    return Response.json({ error: "companies 배열 필요" }, { status: 400 });

  // 3개씩 병렬 처리 + 배치 간 4초 대기 (무료 분당 15회 한도 준수)
  const results = [];
  for (let i = 0; i < companies.length; i += 3) {
    const batch = companies.slice(i, i + 3);
    const batchResults = await Promise.all(
      batch.map(async (company) => {
        const articles = await fetchNaverNews(company);
        const summary = await summarizeWithGemini(company, articles);
        return { company, summary, articles };
      })
    );
    results.push(...batchResults);
    // 마지막 배치가 아니면 4초 대기
    if (i + 3 < companies.length) {
      await new Promise((r) => setTimeout(r, 4000));
    }
  }

  return Response.json({ results, hasAI: !!GEMINI_KEY });
}

type NaverItem = { title: string; link: string; description: string; pubDate: string };
type NaverNews = { title: string; link: string; description: string; pubDate: string };
