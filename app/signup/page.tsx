"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(`오류: ${authError.message}`);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm px-8 py-10 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">가입 신청 완료</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            회원가입이 완료되었습니다.<br />
            관리자 승인 후 로그인하실 수 있습니다.<br />
            승인까지 1~2 영업일이 소요됩니다.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            로그인 페이지로
          </Link>
        </div>
      </div>
    );
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
          회원가입
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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
              비밀번호 (6자 이상)
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

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-amber-500 font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>

      <p className="text-xs text-amber-700/60 mt-8">
        © 2026 CHOI BOND Trading System. All rights reserved.
      </p>
    </div>
  );
}
