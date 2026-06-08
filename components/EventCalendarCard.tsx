"use client";

import Link from "next/link";

// 날짜를 Date 객체로 관리 — 과거 이벤트 자동 필터링
const RAW_EVENTS = [
  { date: new Date("2026-06-02"), label: "한국 5월 소비자물가 발표", badge: "KR", color: "bg-blue-100 text-blue-700" },
  { date: new Date("2026-06-10"), label: "미국 FOMC 의사록 공개",   badge: "US", color: "bg-amber-100 text-amber-700" },
  { date: new Date("2026-06-11"), label: "ECB 금리결정",            badge: "EU", color: "bg-purple-100 text-purple-700" },
  { date: new Date("2026-06-11"), label: "미국 5월 CPI 발표",       badge: "US", color: "bg-amber-100 text-amber-700" },
  { date: new Date("2026-06-12"), label: "한국 5월 수출입 잠정치",  badge: "KR", color: "bg-blue-100 text-blue-700" },
  { date: new Date("2026-06-13"), label: "일본 BOJ 총재 연설",      badge: "JP", color: "bg-red-100 text-red-700" },
  { date: new Date("2026-06-14"), label: "G7 재무장관 회의 결과",   badge: "G7", color: "bg-gray-100 text-gray-700" },
  { date: new Date("2026-06-18"), label: "미국 FOMC 금리결정",      badge: "US", color: "bg-amber-100 text-amber-700" },
  { date: new Date("2026-06-19"), label: "일본 BOJ 금리결정",       badge: "JP", color: "bg-red-100 text-red-700" },
];

const DAY_KR = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(d: Date) {
  return `${d.getMonth() + 1}/${d.getDate()} (${DAY_KR[d.getDay()]})`;
}

export default function EventCalendarCard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 이후 이벤트만 표시 (최대 7개)
  const upcoming = RAW_EVENTS
    .filter((e) => e.date >= today)
    .slice(0, 7);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">향후 주요 이벤트</h3>
        <Link href="/calendar" className="text-xs text-amber-600 font-medium hover:underline">
          전체 보기 →
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-xs text-gray-400 py-4 text-center">예정된 이벤트가 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((ev, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-400 w-16 shrink-0">{formatDate(ev.date)}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${ev.color}`}>
                {ev.badge}
              </span>
              <span className="text-sm text-gray-700 leading-tight">{ev.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
