"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";

type Report = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  author: string;
  usdkrw?: string;
  bond10y?: string;
};

const REPORTS: Report[] = [
  { id: 1, date: "2026-06-06", title: "FX Weekly — 2026.06.06", excerpt: "외국인 코스피 19거래일 연속 사상 최대 순매도(누적 66조원)·중동 긴장 재고조·미 국채금리 상승에 따른 강달러 입력으로 1,530원 돌파. 전주 종가(1,502.8원)에서 급등.", author: "투자전략팀", usdkrw: "1,530", bond10y: "3.42%" },
  { id: 2, date: "2026-06-05", title: "FX Weekly — 2026.06.05", excerpt: "[주간 흐름 요약] 원/달러: 6/1 1,504.30원에서 6/4 1,529.70원으로 주간 +25.40원(+1.69%) 급등, 2009년 이후 17년 만 최고치 진입. 야간 거래에서 1,540...", author: "Hay", usdkrw: "1,529", bond10y: "3.38%" },
  { id: 3, date: "2026-05-30", title: "FX Weekly — 2026.05.30", excerpt: "미·이란 종전 협상 기대 확산·외환당국 1,520원 근접 구두개입·수출업체 네고물량 유입에 1,500원선 안착(전주 1,517.20원에서 하락).", author: "투자전략팀", usdkrw: "1,502", bond10y: "3.31%" },
  { id: 4, date: "2026-05-29", title: "FX Weekly — 2026.05.29", excerpt: "[주간 흐름 요약] 원/달러: 미·이란 종전 협상 기대와 월말 네고에 주초 -12.9원 급락으로 출발, 주중반 1,500선 일시 이탈(장중 저점 1,497.90원).", author: "투자전략팀", usdkrw: "1,517", bond10y: "3.29%" },
  { id: 5, date: "2026-05-23", title: "FX Weekly — 2026.05.23", excerpt: "미 국채금리 급등(30년물 5.20% 2007년 이후 최고)·외국인 코스피 9-10거래일 연속 사상 최대 매도(누적 44조원)에 따른 환전 수요로 1,500원선 돌파.", author: "투자전략팀", usdkrw: "1,483", bond10y: "3.25%" },
  { id: 6, date: "2026-05-22", title: "FX Weekly — 2026.05.22", excerpt: "[주간 흐름 요약] 원/달러: 주초 1,500.3원에서 출발해 화요일 1,507.0원(+6.5원)으로 한 달 반 만 최고치까지 급등.", author: "투자전략팀 (AI 초안)", usdkrw: "1,500", bond10y: "3.22%" },
  { id: 7, date: "2026-05-15", title: "FX Weekly — 2026.05.15", excerpt: "미·이란 휴전 약화 우려·미 인플레이션 재부각·외국인 코스피 사상 최대 연속 순매도에 따른 커스터디 환전 수요로 한 주간 가파른 상승.", author: "투자전략팀", usdkrw: "1,454", bond10y: "3.18%" },
  { id: 8, date: "2026-05-08", title: "FX Weekly — 2026.05.08", excerpt: "미·이란 종전 기대·외국인 코스피 대규모 순매수·일본 환시개입에 따른 엔화 강세 등 우호적 대외 환경에 한 주간 가파른 하락세.", author: "투자전략팀", usdkrw: "1,483", bond10y: "3.15%" },
  { id: 9, date: "2026-04-24", title: "FX Weekly — 2026.04.24", excerpt: "신현송 한은 총재 취임·미·이란 2차 협상 기대에 8.7원 급락 → 협상 무산 반도 → 1,480원대 회복 마감. 코스피 사상 최고치 랠리 동반.", author: "투자전략팀", usdkrw: "1,480", bond10y: "3.12%" },
];

export default function WeeklyPage() {
  const [selected, setSelected] = useState<Report | null>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />

        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← 대시보드로 돌아가기
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-lg">📄</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">FX Weekly Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">주간 외환 시장 분석 리포트</p>
          </div>
        </div>

        {selected ? (
          /* 상세 보기 */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1 transition-colors"
            >
              ← 목록으로
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500 text-sm">📅</span>
              <span className="text-sm font-semibold text-amber-600">{selected.date}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selected.title}</h2>
            <p className="text-sm text-gray-400 mb-6">작성: {selected.author}</p>

            {selected.usdkrw && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs text-amber-500 mb-1">주간 종가 USD/KRW</p>
                  <p className="text-2xl font-bold text-amber-700">{selected.usdkrw}원</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs text-blue-500 mb-1">국고 10년</p>
                  <p className="text-2xl font-bold text-blue-700">{selected.bond10y}</p>
                </div>
              </div>
            )}

            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <p>{selected.excerpt}</p>
              <br />
              <p className="text-gray-400 text-xs">
                * 전체 리포트 내용은 준비 중입니다. 한국은행 ECOS API 및 Claude AI 자동 생성 기능 연동 후 전문이 제공됩니다.
              </p>
            </div>
          </div>
        ) : (
          /* 카드 목록 */
          <div className="grid grid-cols-3 gap-5">
            {REPORTS.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer hover:border-amber-200"
              >
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-amber-500 text-sm">📅</span>
                  <span className="text-xs font-semibold text-amber-600">{r.date}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">{r.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">{r.excerpt}</p>
                {r.usdkrw && (
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium">
                      USD/KRW {r.usdkrw}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      국고10년 {r.bond10y}
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-400">{r.author}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
