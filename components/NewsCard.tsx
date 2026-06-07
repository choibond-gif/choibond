const newsGroups = [
  {
    keyword: "원·달러 환율",
    color: "text-amber-600 bg-amber-50",
    items: [
      { title: "달러 강세에 원화 1,385원 터치…수출업체 네고 물량 유입", time: "09:32" },
      { title: "외환당국, 구두개입 시사…'급격한 쏠림 주시'", time: "10:15" },
      { title: "美 고용 서프라이즈 여파 지속, 원화 약세 압력 당분간 유지", time: "11:48" },
    ],
  },
  {
    keyword: "FOMC · 금리",
    color: "text-blue-600 bg-blue-50",
    items: [
      { title: "Fed 파월 의장 '데이터 의존적 접근 유지…인하 서두르지 않겠다'", time: "07:20" },
      { title: "CME FedWatch, 9월 인하 확률 41%로 하락", time: "08:55" },
      { title: "뉴욕 연은 총재 '물가 목표 달성 아직 멀었다'", time: "13:10" },
    ],
  },
  {
    keyword: "KOSPI · 국내증시",
    color: "text-green-600 bg-green-50",
    items: [
      { title: "외국인 코스피 2,500억 순매수 전환, 반도체 중심 매수세", time: "15:20" },
      { title: "2차전지 하락 지속…코스닥 0.2% 하락 마감", time: "15:35" },
      { title: "기관 순매도 지속, 프로그램 매물 2,800억 출회", time: "16:01" },
    ],
  },
];

export default function NewsCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-gray-900">키워드별 최신 뉴스</h3>
        <a href="#" className="text-xs text-amber-600 font-medium hover:underline">
          뉴스 모니터 →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsGroups.map((group) => (
          <div key={group.keyword}>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${group.color} mb-3 inline-block`}
            >
              # {group.keyword}
            </span>
            <ul className="space-y-3">
              {group.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-xs text-gray-400 shrink-0 mt-0.5">{item.time}</span>
                  <a
                    href="#"
                    className="text-sm text-gray-700 hover:text-amber-600 leading-snug transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
