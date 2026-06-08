"use client";

import { useEffect, useState, useCallback } from "react";

type Company = { id: string; name: string; category: string; active: boolean };
type NewsResult = {
  company: string;
  summary: string;
  articles: { title: string; link: string; pubDate: string }[];
};

const CATEGORY_LABEL: Record<string, string> = {
  CDS: "CDS",
  외화채: "외화채",
  원화채: "원화채",
};
const CATEGORY_COLOR: Record<string, string> = {
  CDS: "bg-purple-100 text-purple-700",
  외화채: "bg-blue-100 text-blue-700",
  원화채: "bg-green-100 text-green-700",
};

export default function CreditNewsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [results, setResults] = useState<NewsResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>("전체");
  const [showManage, setShowManage] = useState(false);
  const [addName, setAddName] = useState("");
  const [addCat, setAddCat] = useState("원화채");
  const [runningIdx, setRunningIdx] = useState<number | null>(null);
  const [hasAI, setHasAI] = useState(true);

  const loadCompanies = useCallback(async () => {
    const res = await fetch("/api/credit-companies");
    const data = await res.json();
    setCompanies(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { loadCompanies(); }, [loadCompanies]);

  const activeCompanies = companies.filter((c) => c.active);
  const filtered = selectedCat === "전체"
    ? activeCompanies
    : activeCompanies.filter((c) => c.category === selectedCat);

  async function runAll() {
    if (filtered.length === 0) return;
    setLoading(true);
    setResults([]);
    const names = filtered.map((c) => c.name);

    const res = await fetch("/api/credit-news", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companies: names }),
    });
    const data = await res.json();
    setResults(data.results ?? []);
    setHasAI(data.hasAI ?? false);
    setFetchedAt(new Date().toLocaleString("ko-KR"));
    setLoading(false);
  }

  async function runSingle(company: string, idx: number) {
    setRunningIdx(idx);
    const res = await fetch(`/api/credit-news?company=${encodeURIComponent(company)}`);
    const data = await res.json();
    setResults((prev) => {
      const exists = prev.findIndex((r) => r.company === company);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = data;
        return next;
      }
      return [...prev, data];
    });
    setHasAI(data.hasAI ?? false);
    setRunningIdx(null);
  }

  async function addCompany() {
    if (!addName.trim()) return;
    await fetch("/api/credit-companies", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: addName.trim(), category: addCat }),
    });
    setAddName("");
    loadCompanies();
  }

  async function deleteCompany(id: string) {
    await fetch(`/api/credit-companies?id=${id}`, { method: "DELETE" });
    loadCompanies();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch("/api/credit-companies", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    loadCompanies();
  }

  const resultMap = Object.fromEntries(results.map((r) => [r.company, r]));
  const categories = ["전체", ...Object.keys(CATEGORY_LABEL)];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">크레딧 뉴스 모니터</h1>
          <p className="text-sm text-gray-500 mt-1">
            모니터링 기업의 신용 관련 뉴스를 자동 검색·요약합니다
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowManage(!showManage)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {showManage ? "닫기" : "🏢 기업 관리"}
          </button>
          <button
            onClick={runAll}
            disabled={loading || filtered.length === 0}
            className="px-5 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                분석 중...
              </>
            ) : (
              "▶ 전체 뉴스 조회"
            )}
          </button>
        </div>
      </div>

      {/* 상태 배지 */}
      {!hasAI && results.length > 0 && (
        <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          ⚠️ ANTHROPIC_API_KEY가 없어 뉴스 제목만 표시됩니다. .env.local에 키를 추가하면 AI 요약이 활성화됩니다.
        </div>
      )}

      {/* 기업 관리 패널 */}
      {showManage && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">모니터링 기업 관리</h2>

          {/* 추가 */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCompany()}
              placeholder="기업명 입력"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <select
              value={addCat}
              onChange={(e) => setAddCat(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none"
            >
              <option value="CDS">CDS</option>
              <option value="외화채">외화채</option>
              <option value="원화채">원화채</option>
            </select>
            <button
              onClick={addCompany}
              className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
            >
              추가
            </button>
          </div>

          {/* 목록 */}
          <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
            {companies.map((c) => (
              <div
                key={c.id}
                className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${
                  c.active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <input
                    type="checkbox"
                    checked={c.active}
                    onChange={() => toggleActive(c.id, c.active)}
                    className="accent-amber-500"
                  />
                  <span className={`text-xs px-1.5 py-0.5 rounded-full shrink-0 ${CATEGORY_COLOR[c.category] ?? "bg-gray-100 text-gray-600"}`}>
                    {c.category}
                  </span>
                  <span className="truncate text-gray-800">{c.name}</span>
                </div>
                <button
                  onClick={() => deleteCompany(c.id)}
                  className="text-gray-300 hover:text-red-400 ml-1 shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">체크박스로 모니터링 ON/OFF 가능 · 총 {companies.length}개 기업 등록</p>
        </div>
      )}

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedCat === cat
                ? "bg-amber-400 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
            <span className="ml-1 text-xs">
              ({cat === "전체"
                ? activeCompanies.length
                : activeCompanies.filter((c) => c.category === cat).length})
            </span>
          </button>
        ))}
        {fetchedAt && (
          <span className="ml-auto text-xs text-gray-400 self-center">
            마지막 조회: {fetchedAt}
          </span>
        )}
      </div>

      {/* 결과 테이블 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-5 py-3 font-semibold text-gray-700 w-44">기업명</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700 w-24">구분</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700">요약 / Analysis</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-700 w-36">뉴스 링크</th>
              <th className="w-16 px-3 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-400">
                  기업 관리에서 모니터링할 기업을 추가하세요
                </td>
              </tr>
            ) : (
              filtered
                .filter((company) => {
                  if (results.length === 0) return true;
                  const r = resultMap[company.name];
                  if (!r) return true;
                  return r.articles.length > 0;
                })
                .map((company, idx) => {
                const result = resultMap[company.name];
                return (
                  <tr key={company.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900 align-top">
                      {company.name}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${CATEGORY_COLOR[company.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {company.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 leading-relaxed align-top max-w-xl">
                      {result ? (
                        <span className={hasAI ? "" : "text-gray-500 text-xs"}>
                          {result.summary}
                        </span>
                      ) : loading ? (
                        <span className="text-gray-300 text-xs">분석 중...</span>
                      ) : (
                        <span className="text-gray-300 text-xs">— 조회 전 —</span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-top">
                      {result?.articles?.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {result.articles.slice(0, 3).map((a, i) => (
                            <a
                              key={i}
                              href={a.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-amber-600 hover:underline truncate max-w-[120px] block"
                              title={a.title}
                            >
                              [{i + 1}] {a.title.slice(0, 15)}...
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 align-top">
                      <button
                        onClick={() => runSingle(company.name, idx)}
                        disabled={runningIdx === idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-amber-100 hover:text-amber-700 disabled:opacity-50"
                      >
                        {runningIdx === idx ? "..." : "조회"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && results.length === 0 && !loading && (
        <p className="text-center text-sm text-gray-400 mt-6">
          ▶ 전체 뉴스 조회 버튼을 눌러 {filtered.length}개 기업의 뉴스를 가져오세요
        </p>
      )}
    </div>
  );
}
