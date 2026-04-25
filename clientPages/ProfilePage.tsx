"use client";
import { useSession } from "@/clientContext/AuthContext";
import { getProfile } from "@/clientServices/profileService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VerifiedBadge from "@/components/ui/verifiedBadge";
import { ProfileInformation } from "@/lib/exportableTypes";
import { currencyNameP } from "@/lib/importableVariables";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
    const params = useParams() as {username: string}
    const {session} = useSession()
    const [profile, setProfile] = useState<ProfileInformation | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        async function loadProfile() {
            const response = await getProfile(params.username, session?.access_token)
            if (!response.error) {
                setProfile(response.data || null)
            }
            setLoading(false)
        }

        loadProfile()
    }, [params.username])

    if (loading) {
        return <EnvolvePage>

        </EnvolvePage>
    }
    if (!profile) return null;
    if (profile.profile_type == "public") {
        return <EnvolvePage>
            <LoadedPublicProfile profile={profile}/>
        </EnvolvePage>
    }
    return <EnvolvePage>
        <LoadedProfile profile={profile} />
    </EnvolvePage>
}

function EnvolvePage({children}: {children?: React.ReactNode}) {
    return (
        <div className="p-7 pt-20">
            {children}
        </div>
    )
}

function LoadedProfile({profile}: {profile: ProfileInformation}) {
    return (
            <div className="flex flex-row items-center gap-2">
                <div className="rounded-full size-[100px] bg-secondary bg-no-repeat bg-center bg-cover" 
                style={{
                    backgroundImage: `url(${profile.avatar_url})`
                }}/>
                <div>
                    <h2 className="font-bold text-2xl">{profile.displayname}</h2>
                    <div className="flex gap-1 items-center">
                        <h3 className="text-muted-foreground">@{profile.username}</h3>
                    {profile.verified_at && <VerifiedBadge width={16} height={16} />}
                    </div>
                </div>
            </div>
        
    )
}

function LoadedPublicProfile({profile}: {profile: ProfileInformation}) {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-2 w-full">
                <div className="rounded-md size-[160px] bg-secondary bg-no-repeat bg-center bg-cover" 
                style={{
                    backgroundImage: `url(${profile.avatar_url})`
                }}/>
                <div>
                    <h2 className="font-bold text-2xl">{profile.displayname}</h2>
                    <div className="flex gap-1">
                        <h3 className="text-muted-foreground">@{profile.username}</h3>
                    {profile.verified_at && <VerifiedBadge width={16} height={16} />}
                    </div>
                    <p className="text-muted-foreground text-sm">Public account</p>
                </div>
            </div>
            <Separator className="my-6"/>
            <section>
                <h3 className="text-muted-foreground font-bold text-xl">Funds</h3>
                <p className="font-bold lg:text-2xl">50,000,000.00</p>
            </section>
            <section className="mt-10">
                <h3 className="text-muted-foreground font-bold text-xl">Recent Transactions</h3>
                ...
            </section>
        </div>
    )
}


function Actions({params}: {params: {username: string}}) {
    return (
        <div>
            <Button size={"xs"}>
                Send {currencyNameP}
            </Button>
        </div>
    )
}