const events = [
  { date: "6/9 (화)", label: "한국 5월 소비자물가 발표", badge: "KR", color: "bg-blue-100 text-blue-700" },
  { date: "6/10 (수)", label: "미국 FOMC 의사록 공개", badge: "US", color: "bg-amber-100 text-amber-700" },
  { date: "6/11 (목)", label: "ECB 금리결정", badge: "EU", color: "bg-purple-100 text-purple-700" },
  { date: "6/11 (목)", label: "미국 5월 CPI 발표", badge: "US", color: "bg-amber-100 text-amber-700" },
  { date: "6/12 (금)", label: "한국 5월 수출입 잠정치", badge: "KR", color: "bg-blue-100 text-blue-700" },
  { date: "6/13 (토)", label: "일본 BOJ 총재 연설", badge: "JP", color: "bg-red-100 text-red-700" },
  { date: "6/14 (일)", label: "G7 재무장관 회의 결과", badge: "G7", color: "bg-gray-100 text-gray-700" },
];

export default function EventCalendarCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">향후 7일 주요 이벤트</h3>
        <a href="#" className="text-xs text-amber-600 font-medium hover:underline">
          전체 보기 →
        </a>
      </div>

      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-16 shrink-0">{ev.date}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${ev.color}`}
            >
              {ev.badge}
            </span>
            <span className="text-sm text-gray-700 leading-tight">{ev.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
