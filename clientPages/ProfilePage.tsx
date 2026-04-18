"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VerifiedBadge from "@/components/ui/verifiedBadge";
import { useParams } from "next/navigation";
import React from "react";

export default function ProfilePage() {
    const params = useParams() as {username: string}


    return <EnvolvePage>
        <LoadedProfile params={params} />
    </EnvolvePage>
}

function EnvolvePage({children}: {children: React.ReactNode}) {
    return (
        <div className="mt-15">
            {children}
        </div>
    )
}

function LoadedProfile({params}: {params: {username: string}}) {
    return (
            <div className="flex flex-row items-center gap-2">
                <div className="rounded-full size-[100px] bg-secondary" />
                <div>
                    <h2 className="font-bold text-2xl">Display Name</h2>
                    <div className="flex gap-1 items-center">
                        <h3 className="text-muted-foreground">{params.username}</h3>
                    <VerifiedBadge width={16} height={16} />
                    </div>
                    <Actions params={params} />
                </div>
            </div>
        
    )
}


function Actions({params}: {params: {username: string}}) {
    return (
        <div>
            <Button size={"xs"}>
                Send Money
            </Button>
        </div>
    )
}