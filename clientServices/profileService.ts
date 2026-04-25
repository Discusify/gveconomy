import { ApiPromise, ApiResponse, ProfileInformation } from "@/lib/exportableTypes";
import { private_api_url } from "@/lib/importableVariables";
import { PersistentGlobalCache } from "./cacheService";
import { FetchWToken } from "./FetchService";

export async function getProfile(username: string, accessToken?: string): ApiPromise<ProfileInformation> {
    const cacheKey = 'profileinformation_' + username
    return FetchWToken('profile/' + username, cacheKey, accessToken)
}