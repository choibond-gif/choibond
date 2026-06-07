"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  email: string;
  approved: boolean;
  role: string;
  created_at: string;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  async function fetchProfiles() {
    const supabase = createClient();
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function toggleApprove(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ approved: !current })
      .eq("id", id);
    fetchProfiles();
  }

  async function setRole(id: string, role: string) {
    const supabase = createClient();
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchProfiles();
  }

  const filtered = profiles.filter((p) => {
    if (filter === "pending") return !p.approved;
    if (filter === "approved") return p.approved;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-sm font-bold text-white">
            ⇄
          </div>
          <span className="font-bold text-amber-400">CHOI BOND</span>
          <span className="text-gray-400 text-sm">/ 관리자</span>
        </div>
        <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← 대시보드로
        </a>
      </div>

      <div className="px-8 py-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">사용자 관리</h1>
        <p className="text-sm text-gray-500 mb-6">
          회원가입 신청자를 승인하거나 권한을 변경합니다.
        </p>

        {/* 필터 탭 */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-amber-400 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? "전체" : f === "pending" ? "⏳ 승인 대기" : "✅ 승인됨"}
              <span className="ml-1 text-xs opacity-70">
                ({f === "all" ? profiles.length : profiles.filter(p => f === "pending" ? !p.approved : p.approved).length})
              </span>
            </button>
          ))}
        </div>

        {/* 테이블 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 text-sm">불러오는 중...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">해당하는 사용자가 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3">이메일</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">가입일</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">권한</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">상태</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{p.email}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(p.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={p.role}
                        onChange={(e) => setRole(p.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      >
                        <option value="user">일반</option>
                        <option value="admin">관리자</option>
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          p.approved
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {p.approved ? "✅ 승인됨" : "⏳ 대기"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleApprove(p.id, p.approved)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          p.approved
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-amber-400 text-white hover:bg-amber-500"
                        }`}
                      >
                        {p.approved ? "승인 취소" : "승인"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
