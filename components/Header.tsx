"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [email, setEmail] = useState("");

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, []);

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-sm text-gray-500">{today}</p>
        <h1 className="text-2xl font-bold text-gray-900">
          안녕하세요,{" "}
          <span className="text-amber-500">{email || "회원"}</span> 님 👋
        </h1>
      </div>
    </div>
  );
}
