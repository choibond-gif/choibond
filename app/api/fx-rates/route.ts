// 한국은행 ECOS API — StatisticSearch(D) + KeyStatisticList 조합
export async function GET() {
  const apiKey = process.env.BOK_API_KEY;
  if (!apiKey) return Response.json({ error: "BOK_API_KEY 없음" }, { status: 500 });

  const monthAgo = getDateStr(-30);
  const today    = getDateStr(0);

  try {
    const [fxRes, rateRes, bond3yRes, bond5yRes, bond10yRes, kospiRes, kosdaqRes] = await Promise.all([
      // 환율 (KeyStatisticList 1-20)
      fetch(`https://ecos.bok.or.kr/api/KeyStatisticList/${apiKey}/json/kr/1/20`,  { next: { revalidate: 3600 } }),
      // 기준금리·회사채 (KeyStatisticList 21-60)
      fetch(`https://ecos.bok.or.kr/api/KeyStatisticList/${apiKey}/json/kr/21/60`, { next: { revalidate: 3600 } }),
      // 국고채 3년 (StatisticSearch D)
      fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/817Y002/D/${monthAgo}/${today}/010200000`, { next: { revalidate: 3600 } }),
      // 국고채 5년
      fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/817Y002/D/${monthAgo}/${today}/010200001`, { next: { revalidate: 3600 } }),
      // 국고채 10년
      fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/817Y002/D/${monthAgo}/${today}/010210000`, { next: { revalidate: 3600 } }),
      // KOSPI
      fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/802Y001/D/${monthAgo}/${today}/0001000`, { next: { revalidate: 3600 } }),
      // KOSDAQ
      fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/802Y001/D/${monthAgo}/${today}/0089000`, { next: { revalidate: 3600 } }),
    ]);

    const [fxData, rateData, bond3yData, bond5yData, bond10yData, kospiData, kosdaqData] = await Promise.all([
      fxRes.json(), rateRes.json(), bond3yRes.json(), bond5yRes.json(),
      bond10yRes.json(), kospiRes.json(), kosdaqRes.json(),
    ]);

    // KeyStatisticList 파싱
    const fxRows:   KSRow[] = fxData?.KeyStatisticList?.row   ?? [];
    const rateRows: KSRow[] = rateData?.KeyStatisticList?.row ?? [];
    const findKS = (rows: KSRow[], name: string) => rows.find((r) => r.KEYSTAT_NAME?.includes(name));

    // StatisticSearch 파싱 — 마지막 2개 값으로 최신·전일 계산
    const parseSearch = (data: SSData) => {
      const rows: SSRow[] = data?.StatisticSearch?.row ?? [];
      const latest = rows[rows.length - 1];
      const prev   = rows[rows.length - 2];
      const val    = parseFloat(latest?.DATA_VALUE ?? "");
      const prevVal= parseFloat(prev?.DATA_VALUE ?? "");
      if (isNaN(val)) return { value: "-", change: null, up: false };
      const diff = isNaN(prevVal) ? 0 : val - prevVal;
      return {
        value:  val.toFixed(3),
        change: isNaN(prevVal) ? null : `${diff >= 0 ? "+" : ""}${diff.toFixed(3)}`,
        up:     diff > 0,
        date:   latest?.TIME ?? "",
      };
    };

    const usdkrw = findKS(fxRows, "원/달러");
    const jpykrw = findKS(fxRows, "원/엔");
    const eurkrw = findKS(fxRows, "원/유로");
    const cnykrw = findKS(fxRows, "원/위안");
    const baserate= findKS(rateRows, "기준금리");
    const corpAA  = findKS(rateRows, "회사채수익률(3년,AA-)");

    const bond3y  = parseSearch(bond3yData);
    const bond5y  = parseSearch(bond5yData);
    const bond10y = parseSearch(bond10yData);
    const kospi   = parseSearch(kospiData);
    const kosdaq  = parseSearch(kosdaqData);

    const fmtFx = (v?: string) =>
      v ? Number(v).toLocaleString("ko-KR", { minimumFractionDigits: 2 }) : "-";

    return Response.json({
      updatedAt: new Date().toISOString(),
      fx: {
        usdkrw: { value: usdkrw?.DATA_VALUE ?? "-" },
        jpykrw: { value: jpykrw?.DATA_VALUE ?? "-" },
        eurkrw: { value: eurkrw?.DATA_VALUE ?? "-" },
        cnykrw: { value: cnykrw?.DATA_VALUE ?? "-" },
      },
      rates: {
        baserate: { value: baserate?.DATA_VALUE ?? "-" },
        bond3y:   bond3y,
        bond5y:   bond5y,
        bond10y:  bond10y,
        corpAA:   { value: corpAA?.DATA_VALUE ?? "-", change: null, up: false },
      },
      market: {
        kospi: {
          value:     kospi.value !== "-"
                       ? Number(parseFloat(kospi.value)).toLocaleString("ko-KR", { minimumFractionDigits: 2 })
                       : "-",
          change:    kospi.change,
          changePct: kospi.change && kospi.value !== "-"
                       ? `${parseFloat(kospi.change) >= 0 ? "+" : ""}${((parseFloat(kospi.change) / (parseFloat(kospi.value) - parseFloat(kospi.change))) * 100).toFixed(2)}%`
                       : null,
          up: kospi.up,
        },
        kosdaq: {
          value: kosdaq.value !== "-"
                   ? Number(parseFloat(kosdaq.value)).toLocaleString("ko-KR", { minimumFractionDigits: 2 })
                   : "-",
        },
        usdkrw: { value: fmtFx(usdkrw?.DATA_VALUE) },
        bond10y: {
          value:  bond10y.value !== "-" ? `${bond10y.value}%` : "-",
          change: bond10y.change,
          up:     bond10y.up,
        },
      },
    });
  } catch (e) {
    console.error("BOK API error:", e);
    return Response.json({ error: "데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

type KSRow  = { KEYSTAT_NAME: string; DATA_VALUE: string; CYCLE: string };
type SSRow  = { TIME: string; DATA_VALUE: string };
type SSData = { StatisticSearch?: { row: SSRow[] } };

function getDateStr(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}
function pad(n: number) { return String(n).padStart(2, "0"); }
