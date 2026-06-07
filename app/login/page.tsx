"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      setLoading(false);
      return;
    }

    if (data.user) {
      // 승인 여부 확인
      const { data: profile } = await supabase
        .from("profiles")
        .select("approved")
        .eq("id", data.user.id)
        .single();

      if (!profile?.approved) {
        router.push("/pending");
      } else {
        router.push("/");
      }
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center px-4">
      {/* 로고 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-amber-400 rounded-2xl flex items-center justify-center mb-3 shadow-md">
          <span className="text-white text-2xl font-bold">⇄</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
          CHOI BOND
        </h1>
        <p className="text-amber-600 text-sm font-medium mt-1">
          Professional Bond Trading System
        </p>
      </div>

      {/* 카드 */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          로그인
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                ✉
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* 로그인 정보 저장 */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-amber-400"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              로그인 정보 저장
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-amber-500 font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>

      <p className="text-xs text-amber-700/60 mt-8">
        © 2026 CHOI BOND Trading System. All rights reserved.
      </p>
    </div>
  );
}
