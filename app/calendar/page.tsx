"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type CalendarEvent = {
  date: string;
  label: string;
  badge: string;
  color: string;
  bgColor: string;
};

const EVENTS: CalendarEvent[] = [
  { date: "2026-06-02", label: "한국 CPI", badge: "KR", color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200" },
  { date: "2026-06-04", label: "ECB 금리결정", badge: "EU", color: "text-purple-700", bgColor: "bg-purple-50 border-purple-200" },
  { date: "2026-06-05", label: "미국 고용보고서 (NFP)", badge: "US", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
  { date: "2026-06-12", label: "미국 CPI", badge: "US", color: "text-red-700", bgColor: "bg-red-50 border-red-200" },
  { date: "2026-06-18", label: "미국 FOMC", badge: "US", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" },
  { date: "2026-06-19", label: "BOJ 금리결정", badge: "JP", color: "text-pink-700", bgColor: "bg-pink-50 border-pink-200" },
];

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView] = useState<"grid" | "list" | "global">("grid");

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const prevMonthDays = getDaysInMonth(year, month - 1);

  const cells: { day: number; currentMonth: boolean; dateStr: string }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, currentMonth: false, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true, dateStr: `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 1 : month + 2;
    const y = month === 11 ? year + 1 : year;
    cells.push({ day: d, currentMonth: false, dateStr: `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}` });
  }

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const getEvents = (dateStr: string) => EVENTS.filter((e) => e.date === dateStr);
  const monthEvents = EVENTS.filter((e) => e.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-blue-500 text-xl">📅</span>
              <h1 className="text-lg font-bold text-gray-900">이벤트 캘린더</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("grid")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${view === "grid" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                ⊞ 그리드
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${view === "list" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                ≡ 리스트
              </button>
              <button
                onClick={() => setView("global")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${view === "global" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                🌐 글로벌 캘린더
              </button>
            </div>
          </div>

          {view === "global" ? (
            /* TradingView 글로벌 경제 캘린더 */
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-3">
                🌐 TradingView 실시간 글로벌 경제 캘린더 — FOMC·ECB·BOJ·CPI 등 자동 업데이트
              </p>
              <iframe
                src="https://www.tradingview-widget.com/embed-widget/events/?locale=ko#%7B%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22600%22%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22countryFilter%22%3A%22us%2Ckr%2Cjp%2Ceu%2Cgb%2Ccn%22%7D"
                style={{ width: "100%", height: 600 }}
                frameBorder="0"
                allowTransparency={true}
                scrolling="no"
              />
              <p className="text-xs text-gray-300 mt-2 text-right">Powered by TradingView</p>
            </div>
          ) : (
            <>
              {/* 월 네비게이션 */}
              <div className="flex items-center justify-between px-6 py-3 bg-blue-50/50 border-b border-gray-100">
                <span className="text-base font-semibold text-gray-800">{year}년 {month + 1}월</span>
                <div className="flex items-center gap-2">
                  <button onClick={goToday} className="px-3 py-1 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors">오늘</button>
                  <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-600">‹</button>
                  <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-gray-600">›</button>
                </div>
              </div>

              {view === "grid" ? (
                <div>
                  <div className="grid grid-cols-7 border-b border-gray-100">
                    {DAYS.map((d, i) => (
                      <div key={d} className={`py-2 text-center text-xs font-semibold ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"}`}>{d}</div>
                    ))}
                  </div>
                  {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 border-b border-gray-100 last:border-b-0">
                      {week.map((cell, ci) => {
                        const isToday = cell.dateStr === todayStr;
                        const events = getEvents(cell.dateStr);
                        return (
                          <div key={ci} className={`min-h-[90px] p-2 border-r border-gray-100 last:border-r-0 ${!cell.currentMonth ? "bg-gray-50/50" : ""}`}>
                            <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium mb-1 ${isToday ? "bg-amber-400 text-white font-bold" : !cell.currentMonth ? "text-gray-300" : ci === 0 ? "text-red-400" : ci === 6 ? "text-blue-400" : "text-gray-700"}`}>
                              {cell.day}
                            </div>
                            <div className="space-y-0.5">
                              {events.map((ev, ei) => (
                                <div key={ei} className={`text-xs px-1.5 py-0.5 rounded border ${ev.bgColor} ${ev.color} flex items-center gap-1 truncate`}>
                                  <span className="text-[10px] font-bold opacity-70">{ev.badge.toLowerCase()}</span>
                                  <span className="truncate">{ev.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6">
                  {monthEvents.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">이번 달 예정된 이벤트가 없습니다.</p>
                  ) : (
                    <div className="space-y-3">
                      {monthEvents.map((ev, i) => {
                        const d = new Date(ev.date);
                        const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
                        return (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                            <div className="text-center w-14 shrink-0">
                              <div className="text-lg font-bold text-gray-800">{d.getDate()}</div>
                              <div className="text-xs text-gray-400">{dayNames[d.getDay()]}요일</div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-bold border ${ev.bgColor} ${ev.color} shrink-0`}>{ev.badge}</div>
                            <div className="text-sm text-gray-800 font-medium">{ev.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
