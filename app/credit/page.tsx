import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const creditSpreads = [
  { label: "AA- 3년", spread: "0.382%", change: "+0.005", up: false },
  { label: "AA- 5년", spread: "0.415%", change: "+0.008", up: false },
  { label: "A+ 3년", spread: "0.621%", change: "+0.012", up: false },
  { label: "A+ 5년", spread: "0.668%", change: "+0.015", up: false },
  { label: "A 3년", spread: "0.892%", change: "-0.003", up: true },
  { label: "BBB+ 3년", spread: "1.245%", change: "+0.022", up: false },
  { label: "BBB 3년", spread: "1.890%", change: "+0.035", up: false },
];

const recentIssuances = [
  { date: "2026-06-07", issuer: "삼성전자", rating: "AAA", amount: "3,000억", tenor: "3년", yield: "3.285%" },
  { date: "2026-06-06", issuer: "현대자동차", rating: "AA+", amount: "2,000억", tenor: "5년", yield: "3.625%" },
  { date: "2026-06-05", issuer: "SK하이닉스", rating: "AA", amount: "1,500억", tenor: "3년", yield: "3.650%" },
  { date: "2026-06-04", issuer: "LG에너지솔루션", rating: "AA-", amount: "2,500억", tenor: "5년", yield: "3.710%" },
  { date: "2026-06-03", issuer: "롯데케미칼", rating: "A+", amount: "1,000억", tenor: "3년", yield: "3.920%" },
];

const RATING_COLORS: Record<string, string> = {
  AAA: "bg-blue-100 text-blue-700",
  "AA+": "bg-blue-100 text-blue-700",
  AA: "bg-blue-100 text-blue-700",
  "AA-": "bg-green-100 text-green-700",
  "A+": "bg-amber-100 text-amber-700",
  A: "bg-amber-100 text-amber-700",
  "BBB+": "bg-orange-100 text-orange-700",
  BBB: "bg-red-100 text-red-700",
};

export default function CreditPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">📈</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">크레딧 모니터</h1>
            <p className="text-sm text-gray-500 mt-0.5">회사채 스프레드 · 발행 현황</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 크레딧 스프레드 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">회사채 크레딧 스프레드 <span className="text-xs text-gray-400 font-normal ml-1">(vs 국고채)</span></h2>
            <div className="space-y-3">
              {creditSpreads.map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{s.spread}</span>
                    <span className={`text-xs font-medium w-16 text-right ${s.up ? "text-blue-500" : "text-red-500"}`}>
                      {s.up ? "" : ""}{s.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-300 mt-4">* 금융투자협회 기준 / 데이터 연동 예정</p>
          </div>

          {/* 주간 발행 요약 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">이번 주 발행 요약</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-500 mb-1">총 발행액</p>
                <p className="text-xl font-bold text-blue-700">1조 200억</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-xs text-amber-500 mb-1">발행 건수</p>
                <p className="text-xl font-bold text-amber-700">5건</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-xs text-green-500 mb-1">평균 금리</p>
                <p className="text-xl font-bold text-green-700">3.638%</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-xs text-purple-500 mb-1">평균 만기</p>
                <p className="text-xl font-bold text-purple-700">3.8년</p>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 발행 내역 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">최근 회사채 발행 내역</h2>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left pb-3 font-medium">발행일</th>
                <th className="text-left pb-3 font-medium">발행사</th>
                <th className="text-left pb-3 font-medium">신용등급</th>
                <th className="text-right pb-3 font-medium">발행금액</th>
                <th className="text-right pb-3 font-medium">만기</th>
                <th className="text-right pb-3 font-medium">발행금리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentIssuances.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm text-gray-500">{r.date}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{r.issuer}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${RATING_COLORS[r.rating] ?? "bg-gray-100 text-gray-600"}`}>
                      {r.rating}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-700 text-right">{r.amount}</td>
                  <td className="py-3 text-sm text-gray-700 text-right">{r.tenor}</td>
                  <td className="py-3 text-sm font-medium text-blue-600 text-right">{r.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-300 mt-4">* 금융투자협회 KOFIA BIS 데이터 연동 예정</p>
        </div>
      </main>
    </div>
  );
}
