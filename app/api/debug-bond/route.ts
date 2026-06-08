// 디버그용 — 국고 10년 StatisticSearch 응답 확인
export async function GET() {
  const apiKey = process.env.BOK_API_KEY;
  const urls = [
    // 시도 1: D (일별) — DD 아님
    `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/817Y002/D/20260501/20260607/010210000`,
    // 시도 2: M (월별)
    `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/5/817Y002/M/202601/202606/010210000`,
    // 시도 3: KOSPI D 주기 (802Y001)
    `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/5/802Y001/D/20260601/20260607/0001000`,
    // 시도 4: 국고 3년 D 주기 (기존 성공 확인용)
    `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/5/817Y002/D/20260501/20260607/010200000`,
  ];

  const results = await Promise.all(
    urls.map(async (url, i) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        return { try: i + 1, url, result: data };
      } catch (e) {
        return { try: i + 1, url, error: String(e) };
      }
    })
  );

  return Response.json(results);
}
