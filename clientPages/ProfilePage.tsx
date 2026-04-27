"use client";
import { useSession } from "@/clientContext/AuthContext";
import { getProfile, getProfileFunds } from "@/clientServices/profileService";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import VerifiedBadge from "@/components/ui/verifiedBadge";
import { ProfileInformation } from "@/lib/exportableTypes";
import { currencyNameP } from "@/lib/importableVariables";
import { useParams } from "next/navigation";
import { usePayment } from "@/clientContext/PaymentContext";
import React, { useEffect, useState } from "react";
import { formatMoneyFromCents } from "@/lib/utilities";
import { Skeleton } from "@/components/ui/skeleton";

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
    const [funds, setFunds] = useState<string | null>(null)
    const [loadingExtra, setLoadingExtra] = useState<boolean>(true)
    const {session} = useSession()

    useEffect(() => {
        async function loadFunds() {
            setLoadingExtra(true)
            const response = await getProfileFunds(profile.username, session?.access_token)
            console.log(response)
            if (!response.error) {
                setFunds(response.data?.wallet_balance || "0")
            }
            setLoadingExtra(false)
        }
        loadFunds()
    }, [profile.username])
    return (
        <div className="w-full">
            <div className="flex flex-col gap-2 w-full">
                <div className="rounded-md size-[160px] bg-secondary bg-no-repeat bg-center bg-cover" 
                style={{
                    backgroundImage: `url(${profile.avatar_url})`
                }}/>
                <div>
                    <h2 className="font-bold text-2xl select-none">{profile.displayname}</h2>
                    <div className="flex gap-1">
                        <h3 className="text-muted-foreground">@{profile.username}</h3>
                    {profile.verified_at && <VerifiedBadge width={16} height={16} />}
                    </div>
                    <p className="text-muted-foreground text-sm select-none">Public account</p>
                    {profile.about && <div className="mt-2">
                        <p className="text-sm text-muted-foreground select-none">{profile.about}</p>
                    </div>}
                </div>
            </div>
            <Actions profile={profile}/>
            <Separator className="my-6"/>
            <section>
                <h3 className="text-muted-foreground font-bold text-xl">Funds</h3>
                {!loadingExtra ? 
                    <p className="font-bold lg:text-2xl select-none">{formatMoneyFromCents(funds || "0")}</p> :
                    <Skeleton className="w-full max-w-[300px] h-[24px] lg:h-[32px]" />}
            </section>
            <section className="mt-10">
                <h3 className="text-muted-foreground font-bold text-xl">Recent Transactions</h3>
                ...
            </section>
        </div>
    )
}


function Actions({profile}: {profile: ProfileInformation}) {
    const { openPayment } = usePayment();
    const {profile: selfProfile} = useSession()
    const isOwnProfile = selfProfile?.username === profile.username

    function OwnActions() {
        return (
            <>
             <Button size={"sm"} onClick={() => openPayment({})}>
                Send {currencyNameP} to someone
            </Button>
                <Button variant={"outline"} size={"sm"}>
                View My Transactions
            </Button>
            <Button variant={"outline"} size={"sm"}>
                Edit Profile
            </Button>
            </>
        )
    }
    function OthersActions() {
        return (
            <>
             <Button size={"sm"} onClick={() => openPayment({ username: profile.username})}>
                Send {currencyNameP}
            </Button>
            <Button variant={"outline"} size={"sm"}>
                View Transactions With {profile.displayname}
            </Button>
            </>
        )
    }
    return (
        <div className="flex flex-row items-center gap-4 mt-4">
            {isOwnProfile ? <OwnActions /> : <OthersActions />}
        </div>
    )
}