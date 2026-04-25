import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id");

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || "1");
  let limit = Number(searchParams.get("limit") || "10");

  const allowedLimits = [5, 10, 20];
  if (!allowedLimits.includes(limit)) {
    limit = 10;
  }

  const offset = (page - 1) * limit;

  const { data, error } = await supabase.rpc("get_user_transactions", {
    user_id: userId,
    page_limit: limit,
    page_offset: offset,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    page,
    limit,
    data,
  });
}