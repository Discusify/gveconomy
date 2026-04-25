import { ApiResponse } from "@/lib/exportableTypes";
import { private_api_url } from "@/lib/importableVariables";
import { PersistentGlobalCache } from "./cacheService";

export async function FetchWToken(path: string, cacheKey: string, accessToken?: string) {
    const pathToFetch = `${private_api_url}/${path}`
    console.log(pathToFetch)
    if (!accessToken) {
        throw new Error("access token is null")
    }
    
    if (PersistentGlobalCache.has(cacheKey)) {
        return PersistentGlobalCache.get(cacheKey) || {}
    }

    try {
        const response = await fetch(pathToFetch,{
            method: "GET",
            headers: {
                authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
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