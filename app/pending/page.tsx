"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm px-8 py-10 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">승인 대기 중</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          회원가입 신청이 접수되었습니다.<br />
          관리자 승인 후 서비스를 이용하실 수 있습니다.<br />
          <span className="text-amber-600 font-medium">승인까지 1~2 영업일이 소요됩니다.</span>
        </p>
        <button
          onClick={handleLogout}
          className="mt-6 w-full border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors text-sm"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
