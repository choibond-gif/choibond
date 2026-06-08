import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "원달러 환율";

  const res = await fetch(
    `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=date`,
    {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
      next: { revalidate: 300 }, // 5분 캐시
    }
  );

  if (!res.ok) {
    return Response.json({ error: "뉴스를 불러오지 못했습니다." }, { status: res.status });
  }

  const data = await res.json();
  return Response.json(data);
}
