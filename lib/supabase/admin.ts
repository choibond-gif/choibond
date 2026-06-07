import { createClient } from "@supabase/supabase-js";

// 서버 전용 - RLS 우회용 admin 클라이언트
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
