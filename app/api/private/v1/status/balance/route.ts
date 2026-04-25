import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
) {
    const userId = request.headers.get("x-user-id");

  if (!userId) return Response.json({code: 401, error: "Userid cannot be null"})
  const {data, error} = await supabase.from('wallets')
  .select('balance')
  .eq('user_relation', userId)
  .maybeSingle()
  return Response.json(data);
}