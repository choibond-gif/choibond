const indicators = [
  { label: "KOSPI", value: "2,748.32", change: "+0.43%", up: true },
  { label: "KOSDAQ", value: "843.21", change: "-0.18%", up: false },
  { label: "USD·KRW", value: "1,382.50", change: "+3.20", up: false },
  { label: "국고10년", value: "3.285%", change: "-0.012", up: true },
];

export default function BriefingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
            CHOI BOND 오늘의 브리핑
          </span>
          <p className="text-xs text-gray-400 mt-1">2026년 6월 7일 (일)</p>
        </div>
        <a
          href="#"
          className="text-xs text-amber-600 font-medium hover:underline"
        >
          전체 보고서 →
        </a>
      </div>

      {/* 헤드라인 */}
      <h2 className="text-lg font-bold text-gray-900 mb-4 leading-snug">
        미 고용 호조에 달러 강세 지속 — 원화 1,380원대 중반 등락
      </h2>

      {/* 지표 4개 */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="bg-gray-50 rounded-xl p-3 text-center"
          >
            <p className="text-xs text-gray-500 mb-1">{ind.label}</p>
            <p className="text-sm font-bold text-gray-900">{ind.value}</p>
            <p
              className={`text-xs font-medium mt-0.5 ${
                ind.up ? "text-blue-500" : "text-red-500"
              }`}
            >
              {ind.change}
            </p>
          </div>
        ))}
      </div>

      {/* 본문 요약 */}
      <p className="text-sm text-gray-600 leading-relaxed">
        미국 5월 비농업 고용이 예상을 상회하며 Fed의 조기 금리인하 기대가
        후퇴했다. 달러인덱스는 104.8 수준을 회복했으며, 원·달러 환율은
        1,382~1,385원 구간에서 거래됐다. KOSPI는 외국인 순매수 전환으로
        낙폭을 줄였으나 장 후반 차익실현 매물에 소폭 하락 마감했다. 국고채
        10년물 금리는 미국채 약세를 반영해 소폭 상승 압력을 받았다.
      </p>
    </div>
  );
}
