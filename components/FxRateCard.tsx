const rates = [
  { pair: "USD / KRW", rate: "1,382.50", change: "+3.20", up: false },
  { pair: "EUR / KRW", rate: "1,503.40", change: "-2.10", up: true },
  { pair: "JPY / KRW", rate: "8.92", change: "+0.05", up: false },
  { pair: "CNH / KRW", rate: "190.32", change: "+0.88", up: false },
  { pair: "GBP / KRW", rate: "1,754.10", change: "-5.30", up: true },
];

const bonds = [
  { label: "국고 2년", yield: "3.125%", change: "-0.008", up: true },
  { label: "국고 5년", yield: "3.210%", change: "-0.010", up: true },
  { label: "국고 10년", yield: "3.285%", change: "-0.012", up: true },
  { label: "미국 10년", yield: "4.512%", change: "+0.032", up: false },
];

export default function FxRateCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">환율 · 금리</h3>

      {/* 환율 */}
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">환율</p>
      <div className="space-y-2 mb-5">
        {rates.map((r) => (
          <div key={r.pair} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{r.pair}</span>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{r.rate}</span>
              <span
                className={`text-xs ml-2 ${r.up ? "text-blue-500" : "text-red-500"}`}
              >
                {r.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 금리 */}
      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">금리</p>
      <div className="space-y-2">
        {bonds.map((b) => (
          <div key={b.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{b.label}</span>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900">{b.yield}</span>
              <span
                className={`text-xs ml-2 ${b.up ? "text-blue-500" : "text-red-500"}`}
              >
                {b.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
