import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const {username} = await params 

  const {data, error} = await supabase.rpc('get_wallet_balance', { in_username: username })
  .single()
    if (error) {
        console.error("Error fetching wallet balance:", error);
        return Response.json({ error: "Failed wallet balance" }, { status: 500 });
    }
  return Response.json(data);
}