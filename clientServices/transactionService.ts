import { ApiPromise, ApiResponse, ProfileInformation } from "@/lib/exportableTypes";
import { private_api_url } from "@/lib/importableVariables";
import { PersistentGlobalCache } from "./cacheService";
import { PostWToken } from "./FetchService";

export async function postTransaction(shipTo: string,amount: number, message?: string, accessToken?: string) {
    if (!accessToken) {
        throw new Error("access token is null")
    }
    const body = {
        receiver: shipTo,
        amount: amount,
        note: message || ""
    }
    const response = await PostWToken("transaction", body, accessToken)
    return {
        data: response.data,
        error: response.error
    } as ApiResponse<{ success: boolean }>
}