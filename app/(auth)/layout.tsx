import { getServerSession } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({children}: {children: ReactNode}) {
    const session = await getServerSession()

    if (session) {
        redirect('/')
    }

    return (
        <>
        {children}
        </>
    )
}