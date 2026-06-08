// 한국은행 ECOS API — 회사채 수익률 & 크레딧 스프레드
export const revalidate = 3600; // 1시간 캐시

export async function GET() {
  const apiKey = process.env.BOK_API_KEY;
  if (!apiKey) return Response.json({ error: "BOK_API_KEY 없음" }, { status: 500 });

  const today   = getDateStr(0);
  const monthAgo = getDateStr(-30);

  try {
    // ECOS StatisticSearch — 일별 데이터
    const codes = {
      bond3y:  "010200000", // 국고채(3년)
      bond5y:  "010200001", // 국고채(5년)
      bond10y: "010210000", // 국고채(10년)
      corpAA:  "010300000", // 회사채(3년, AA-)
      corpBBB: "010320000", // 회사채(3년, BBB-)
    };

    const fetches = Object.entries(codes).map(([key, code]) =>
      fetch(
        `https://ecos.bok.or.kr/api/StatisticSearch/${apiKey}/json/kr/1/10/817Y002/D/${monthAgo}/${today}/${code}`,
        { next: { revalidate: 3600 } }
      ).then((r) => r.json()).then((d) => [key, d])
    );

    const results = Object.fromEntries(await Promise.all(fetches));

    const parse = (key: string) => {
      const rows: Row[] = results[key]?.StatisticSearch?.row ?? [];
      if (rows.length === 0) return { value: null, prev: null, date: "" };
      const latest = rows[rows.length - 1];
      const prev   = rows[rows.length - 2];
      return {
        value: parseFloat(latest.DATA_VALUE),
        prev:  prev ? parseFloat(prev.DATA_VALUE) : null,
        date:  latest.TIME,
      };
    };

    const bond3y  = parse("bond3y");
    const bond5y  = parse("bond5y");
    const bond10y = parse("bond10y");
    const corpAA  = parse("corpAA");
    const corpBBB = parse("corpBBB");

    const spread = (corp: ReturnType<typeof parse>, gov: ReturnType<typeof parse>) => {
      if (!corp.value || !gov.value) return null;
      const s = corp.value - gov.value;
      const prevS = corp.prev && gov.prev ? corp.prev - gov.prev : null;
      const diff = prevS !== null ? s - prevS : null;
      return {
        value:  s.toFixed(3) + "%",
        raw:    s,
        change: diff !== null ? (diff >= 0 ? "+" : "") + diff.toFixed(3) : null,
        up:     diff !== null ? diff > 0 : false,
      };
    };

    const fmt = (v: number | null) => v !== null ? v.toFixed(3) + "%" : "-";
    const chg = (cur: number | null, prv: number | null) => {
      if (!cur || !prv) return null;
      const d = cur - prv;
      return (d >= 0 ? "+" : "") + d.toFixed(3);
    };

    const dataDate = bond3y.date
      ? `${bond3y.date.slice(0, 4)}.${bond3y.date.slice(4, 6)}.${bond3y.date.slice(6, 8)}`
      : "";

    return Response.json({
      dataDate,
      govBonds: [
        { label: "국고채 3년",  value: fmt(bond3y.value),  change: chg(bond3y.value, bond3y.prev)   },
        { label: "국고채 5년",  value: fmt(bond5y.value),  change: chg(bond5y.value, bond5y.prev)   },
        { label: "국고채 10년", value: fmt(bond10y.value), change: chg(bond10y.value, bond10y.prev) },
      ],
      corpBonds: [
        { label: "회사채 AA- (3년)", value: fmt(corpAA.value),  change: chg(corpAA.value, corpAA.prev)   },
        { label: "회사채 BBB- (3년)", value: fmt(corpBBB.value), change: chg(corpBBB.value, corpBBB.prev) },
      ],
      spreads: [
        { label: "AA- 3년 스프레드",  ...spread(corpAA, bond3y)  },
        { label: "BBB- 3년 스프레드", ...spread(corpBBB, bond3y) },
      ],
    });
  } catch (e) {
    console.error("credit-data error:", e);
    return Response.json({ error: "데이터 조회 실패" }, { status: 500 });
  }
}

type Row = { TIME: string; DATA_VALUE: string };

function getDateStr(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}
