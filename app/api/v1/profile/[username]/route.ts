import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const {username} = await params 

  const {data, error} = await supabase.from('profiles').select('*').eq('username', username)
  .maybeSingle()
  return Response.json(data);
}