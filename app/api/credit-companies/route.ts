import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 기업 목록 조회
export async function GET() {
  const { data, error } = await supabase
    .from("credit_companies")
    .select("*")
    .order("category")
    .order("name");

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

// 기업 추가
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category } = body;
  if (!name || !category)
    return Response.json({ error: "name, category 필요" }, { status: 400 });

  const { data, error } = await supabase
    .from("credit_companies")
    .insert({ name, category, active: true })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}

// 기업 삭제
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id 필요" }, { status: 400 });

  const { error } = await supabase
    .from("credit_companies")
    .delete()
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

// active 토글
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, active } = body;

  const { error } = await supabase
    .from("credit_companies")
    .update({ active })
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
