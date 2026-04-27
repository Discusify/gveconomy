import { NextRequest } from "next/server";
import supabase from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
) {
    const senderId = request.headers.get("x-user-id");
    // Authentication check
    if (!senderId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {receiver, amount, note }:
     {receiver: string, amount: number, note: string} = await request.json();
     // Input validation
     // Validate receiver
     if (typeof receiver !== "string" || receiver.trim() === "") {
        return Response.json({ error: "Invalid receiver" }, { status: 400 });
    }

    // Validate amount
    if (typeof amount !== "number") {
        return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    if (amount <= 0) {
        return Response.json({ error: "Amount must be greater than zero" }, { status: 400 });
    }
    if (amount % 1 !== 0) {
        return Response.json({ error: "Amount must be an integer" }, { status: 400 });
    }
    const { data: receiverData, error: receiverError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", receiver)
        .single();

    if (receiverError || !receiverData) {
        return Response.json({ error: "Receiver not found" }, { status: 404 });
    }

    if (receiverData.id === senderId) {
        return Response.json({ error: "Cannot transfer to self" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("transfer_funds", {
        sender: senderId,
        receiver: receiverData.id,
        amount: amount,
        description: note,
    });

    if (error) {
        return Response.json({ error: "Server Error" }, { status: 500 });
    }
    return Response.json({ success: true});
}