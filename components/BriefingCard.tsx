"use client";

import { useEffect, useState } from "react";

type ApiData = {
  market?: {
    kospi:  { value: string; change: string | null; changePct: string | null; up: boolean };
    kosdaq: { value: string };
    usdkrw: { value: string };
    bond10y:{ value: string; change: string | null; up: boolean };
  };
};

const today    = new Date();
const dateStr  = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

export default function BriefingCard() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fx-rates")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const m = data?.market;

  const indicators = [
    { label: "KOSPI",   value: m?.kospi.value  ?? "-", change: m?.kospi.changePct ?? null,   up: m?.kospi.up  ?? false },
    { label: "KOSDAQ",  value: m?.kosdaq.value ?? "-", change: null,                          up: false },
    { label: "USD·KRW", value: m?.usdkrw.value ?? "-", change: null,                          up: false },
    { label: "국고10년", value: m?.bond10y.value ?? "-", change: m?.bond10y.change ?? null,   up: m?.bond10y.up ?? false },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
            CHOI BOND 오늘의 브리핑
          </span>
          <p className="text-xs text-gray-400 mt-1">
            {dateStr} ({dayNames[today.getDay()]})
          </p>
        </div>
        <a href="/archive" className="text-xs text-amber-600 font-medium hover:underline">
          전체 보고서 →
        </a>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4 leading-snug">
        실시간 시장 지표 — 한국은행 ECOS
      </h2>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {indicators.map((ind) => (
          <div key={ind.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">{ind.label}</p>
            {loading ? (
              <div className="flex items-center justify-center h-8">
                <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-900">{ind.value}</p>
                {ind.change && (
                  <p className={`text-xs font-medium mt-0.5 ${ind.up ? "text-blue-500" : "text-red-500"}`}>
                    {ind.change}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">
        한국은행 ECOS Open API 실시간 데이터. KOSPI: {m?.kospi.value ?? "조회 중"} ·
        USD/KRW: {m?.usdkrw.value ?? "조회 중"} · 국고10년: {m?.bond10y.value ?? "조회 중"}
        <br />
        <span className="text-xs text-gray-400">오늘의 브리핑 자동 생성 기능은 준비 중입니다.</span>
      </p>
    </div>
  );
}
