"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";

type NaverNewsItem = {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
};

const KEYWORDS = ["전체", "원/달러", "FOMC", "한은 금통위", "달러인덱스", "국고채"];

const KEYWORD_QUERIES: Record<string, string> = {
  "전체": "원달러 환율 채권 금리",
  "원/달러": "원달러 환율",
  "FOMC": "FOMC 연준 금리",
  "한은 금통위": "한국은행 금통위 기준금리",
  "달러인덱스": "달러인덱스 DXY",
  "국고채": "국고채 금리",
};

const KEYWORD_COLORS: Record<string, string> = {
  "원/달러": "bg-amber-100 text-amber-700",
  "FOMC": "bg-blue-100 text-blue-700",
  "한은 금통위": "bg-green-100 text-green-700",
  "달러인덱스": "bg-purple-100 text-purple-700",
  "국고채": "bg-red-100 text-red-700",
  "전체": "bg-gray-100 text-gray-700",
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function timeAgo(pubDate: string) {
  const diff = Date.now() - new Date(pubDate).getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function NewsPage() {
  const [activeKeyword, setActiveKeyword] = useState("전체");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [news, setNews] = useState<NaverNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async (keyword: string, searchQuery: string) => {
    setLoading(true);
    setError("");
    const q = searchQuery || KEYWORD_QUERIES[keyword];
    try {
      const res = await fetch(`/api/news?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("API 오류");
      const data = await res.json();
      setNews(data.items ?? []);
    } catch {
      setError("뉴스를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(activeKeyword, search);
  }, [activeKeyword, fetchNews]);

  const handleSearch = () => {
    setSearch(searchInput);
    setActiveKeyword("전체");
    fetchNews("전체", searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleKeywordClick = (kw: string) => {
    setActiveKeyword(kw);
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 px-8 py-8">
        <Header />

        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← 대시보드
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg">📋</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">뉴스 모니터</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {loading ? "뉴스 불러오는 중..." : `총 ${news.length}개의 뉴스`}
            </p>
          </div>
        </div>

        {/* 검색 + 필터 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="뉴스 제목/내용 검색..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              검색
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">▽ 키워드 필터</span>
            {KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => handleKeywordClick(kw)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${activeKeyword === kw && !search ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* 뉴스 목록 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-400">뉴스 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-red-400 text-sm">{error}</div>
          ) : news.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">검색 결과가 없습니다.</div>
          ) : (
            news.map((n, i) => (
              <div key={i} className="flex gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="mt-1 text-gray-400 text-sm shrink-0">↗</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${KEYWORD_COLORS[search ? "전체" : activeKeyword]}`}>
                      {search ? "검색" : activeKeyword}
                    </span>
                    <span className="text-xs text-gray-400">⏱ {timeAgo(n.pubDate)}</span>
                  </div>
                  <a
                    href={n.originallink || n.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-gray-900 hover:text-amber-600 transition-colors block mb-1"
                  >
                    {stripHtml(n.title)}
                  </a>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{stripHtml(n.description)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
