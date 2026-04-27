import { ApiPromise, ApiResponse, ProfileInformation } from "@/lib/exportableTypes";
import { private_api_url } from "@/lib/importableVariables";
import { PersistentGlobalCache } from "./cacheService";
import { FetchWToken } from "./FetchService";

export async function getProfile(username: string, accessToken?: string): ApiPromise<ProfileInformation> {
    const cacheKey = 'profileinformation_' + username
    return FetchWToken('profile/' + username, cacheKey, accessToken)
}

export async function getProfileFunds(username: string, accessToken?: string): ApiPromise<{ wallet_balance: string }> {
    const cacheKey = 'profilefunds_' + username
    return FetchWToken('profile/' + username + '/funds', cacheKey, accessToken)
}