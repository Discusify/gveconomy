"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useSession } from "@/clientContext/AuthContext";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";


export default function PaymentPage() {
    const { profile } = useSession()
    const [loading, setLoading] = useState<boolean>(true)
    const params = useParams() as { payment_id: string }
    const separatorClass = "my-4"
    const titlesClass = "mt-4 mb-4 text-lg"

    useEffect(() => {
        async function loadPayment() {
            setTimeout(() => {
                setLoading(false)
            }, 3000)
        }
        loadPayment()
    }, [])
    return (
        <div className="flex flex-col items-center p-6 select-none">
            <div className="w-full max-w-md bg-sidebar rounded-lg shadow-md p-6">
                <p className="text-muted-foreground">Hi, {profile?.displayname}!</p>
                <Separator className={separatorClass} />
                <p className={titlesClass}>You're about to pay</p>
                {loading ? <Skeleton className="w-full h-10 mb-4" /> :
                    <h3 className="font-bold text-3xl">PRODUCT EXAMPLE: LONG TITLE FOR TEST</h3>}
                <Separator className={separatorClass} />
                <p className={titlesClass}>Ship To</p>
                {loading ? <LoadingShipToComponent /> : <ShipToComponent />}
                <Separator className={separatorClass} />
                <p className={titlesClass}>Total Amount</p>
                {loading ? <Skeleton className="w-full h-12 mb-4" /> :
                <p className="font-bold text-5xl">1,600.00</p>}
                <Button className="mt-5 w-full" size={"lg"} disabled={loading}>Pay Now</Button>
            </div>
        </div>
    )
}

function ShipToComponent() {
    return (
        <div className="flex items-center gap-2 mb-4">
            <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <p>@username</p>
        </div>
    )
}

function LoadingShipToComponent() {
    return (
        <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-20 h-6" />
        </div>
    )
}