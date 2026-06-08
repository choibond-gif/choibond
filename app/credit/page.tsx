"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type GovBond  = { label: string; value: string; change: string | null };
type CorpBond = { label: string; value: string; change: string | null };
type Spread   = { label: string; value: string; raw: number; change: string | null; up: boolean };

type CreditData = {
  dataDate: string;
  govBonds:  GovBond[];
  corpBonds: CorpBond[];
  spreads:   Spread[];
};

const RATING_COLORS: Record<string, string> = {
  AAA:  "bg-blue-100 text-blue-700",
  "AA+":"bg-blue-100 text-blue-700",
  AA:   "bg-blue-100 text-blue-700",
  "AA-":"bg-green-100 text-green-700",
  "A+": "bg-amber-100 text-amber-700",
  A:    "bg-amber-100 text-amber-700",
  "BBB+":"bg-orange-100 text-orange-700",
  BBB:  "bg-red-100 text-red-700",
};

export default function CreditPage() {
  const [data, setData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credit-data")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const Spinner = () => (
    <div className="flex items-center justify-center py-10">
      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ChangeTag = ({ change, up }: { change: string | null; up?: boolean }) => {
    if (!change) return null;
    const isUp = up ?? change.startsWith("+");
    return (
      <span className={`text-xs font-medium ${isUp ? "text-red-500" : "text-blue-500"}`}>
        {change}
      </span>
    );
  };

  // 스프레드 크기에 따른 색상
  const spreadColor = (raw: number) => {
    if (raw < 0.5) return "text-blue-600";
    if (raw < 1.5) return "text-green-600";
    if (raw < 3.0) return "text-amber-600";
    return "text-red-600";
  };

  const spreadBar = (raw: number, max = 8) => {
    const pct = Math.min((raw / max) * 100, 100);
    const color = raw < 1.5 ? "bg-green-400" : raw < 3.0 ? "bg-amber-400" : "bg-red-400";
    return (
      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">📈</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">크레딧 모니터</h1>
              <p className="text-sm text-gray-500 mt-0.5">회사채 스프레드 · 금리 현황</p>
            </div>
          </div>
          {data?.dataDate && (
            <span className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-lg">
              기준일: {data.dataDate} · 한국은행 ECOS
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 크레딧 스프레드 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              회사채 크레딧 스프레드
              <span className="text-xs text-gray-400 font-normal ml-1">(vs 국고채 3년)</span>
            </h2>
            <p className="text-xs text-gray-400 mb-4">수치가 클수록 신용 리스크 높음</p>

            {loading ? <Spinner /> : (
              <div className="space-y-4">
                {data?.spreads.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{s.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${spreadColor(s.raw)}`}>{s.value}</span>
                        <ChangeTag change={s.change} up={s.up} />
                      </div>
                    </div>
                    {spreadBar(s.raw)}
                  </div>
                ))}

                <div className="border-t border-gray-50 pt-3 mt-2">
                  <p className="text-xs text-gray-400 mb-2 font-medium">개별 회사채 수익률</p>
                  {data?.corpBonds.map((b) => (
                    <div key={b.label} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-600">{b.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">{b.value}</span>
                        <ChangeTag change={b.change} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 국고채 금리 */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">국고채 수익률 커브</h2>
            {loading ? <Spinner /> : (
              <>
                <div className="space-y-3 mb-6">
                  {data?.govBonds.map((b) => (
                    <div key={b.label} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{b.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-700">{b.value}</span>
                        <ChangeTag change={b.change} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* 간이 바 차트 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-3 font-medium">수익률 비교</p>
                  {data?.govBonds.map((b) => {
                    const val = parseFloat(b.value);
                    const pct = Math.min((val / 6) * 100, 100);
                    return (
                      <div key={b.label} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 w-16">{b.label.replace("국고채 ", "")}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-blue-700 w-12 text-right">{b.value}</span>
                      </div>
                    );
                  })}
                  {data?.corpBonds.map((b) => {
                    const val = parseFloat(b.value);
                    const pct = Math.min((val / 12) * 100, 100);
                    const isHigh = val > 5;
                    return (
                      <div key={b.label} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500 w-16">{b.label.replace("회사채 ", "").split(" ")[0]}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${isHigh ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`text-xs font-medium w-12 text-right ${isHigh ? "text-red-600" : "text-amber-600"}`}>{b.value}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 크레딧 리스크 요약 카드 */}
        {!loading && data && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "국고 3년", value: data.govBonds[0]?.value, color: "blue" },
              { label: "국고 10년", value: data.govBonds[2]?.value, color: "blue" },
              { label: "AA- 스프레드", value: data.spreads[0]?.value, color: "green" },
              { label: "BBB- 스프레드", value: data.spreads[1]?.value, color: "red" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
                <p className="text-xs text-gray-500 mb-2">{item.label}</p>
                <p className={`text-xl font-bold ${
                  item.color === "blue" ? "text-blue-700" :
                  item.color === "green" ? "text-green-600" : "text-red-600"
                }`}>{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* 안내 */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-sm font-medium text-amber-800 mb-1">📌 데이터 안내</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            한국은행 ECOS Open API 기준 (1시간 갱신). ECOS에서 제공하는 등급은 <strong>AA- 3년</strong>과 <strong>BBB- 3년</strong>입니다.
            A+, A, BBB+ 등급은 KOFIA(금융투자협회) API 연동을 통해 추가 예정입니다.
          </p>
        </div>
      </main>
    </div>
  );
}
