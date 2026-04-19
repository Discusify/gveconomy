import { ApiResponse, ProfileInformation } from "@/lib/exportableTypes";
import { api_url } from "@/lib/importableVariables";
import { PersistentGlobalCache } from "./cacheService";

export async function getProfile(username: string): Promise<ApiResponse<ProfileInformation>> {
    const cacheKey = 'profileinformation_' + username
    if (PersistentGlobalCache.has(cacheKey)) {
        return PersistentGlobalCache.get(cacheKey) || {}
    }

    try {
        const response = await fetch(`${api_url}/profile/${username}`,{
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        })

        if (!response.ok) {
            const errordata =  await response.json().catch(() => ({}))
            return {
                error: errordata.error || `Error: ${response.status}`
            }
        }

        const data = await response.json()

        return {
            data: data,
            code: data.code
        }
    } catch(errorof) {
        return {
            error: "error"
        }
    }
}