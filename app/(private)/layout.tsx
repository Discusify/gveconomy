import { getServerSession } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation"
import { ReactNode } from "react";

export default async function PrivateLayout({children}: {children: ReactNode}) {
    const session = await getServerSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <>
        {children}
        </>
    )
}