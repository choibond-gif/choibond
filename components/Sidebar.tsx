"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "대시보드", href: "/", icon: "▦" },
  { label: "이벤트 캘린더", href: "/calendar", icon: "📅" },
  { label: "채권 위클리", href: "/weekly", icon: "📊" },
  { label: "크레딧 모니터", href: "/credit", icon: "📈" },
  { label: "뉴스 모니터", href: "/news", icon: "📰" },
  { label: "브리핑 아카이브", href: "/archive", icon: "🗂" },
  { label: "규정 챗봇", href: "/chatbot", icon: "💬" },
  { label: "관리자", href: "/admin", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col">
      {/* 로고 */}
      <div className="px-6 py-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-sm font-bold text-white">
            ⇄
          </div>
          <span className="text-xl font-bold text-amber-400 tracking-widest">CHOI</span>
          <span className="text-xl font-bold text-white tracking-widest">BOND</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Bond Trading System</p>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-400 text-gray-900"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 로그아웃 */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <span>🚪</span>
          로그아웃
        </button>
        <p className="text-xs text-gray-700 text-center mt-2">v1.0.0 · CHOI BOND</p>
      </div>
    </aside>
  );
}
