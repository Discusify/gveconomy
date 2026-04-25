import { ApiPromise, TransactionsResponse } from "@/lib/exportableTypes";
import { FetchWToken } from "./FetchService";

export async function getBalance(accessToken?: string): ApiPromise<{balance: number}> {
    const cacheKey = 'Balance'
    return FetchWToken('status/balance', cacheKey, accessToken)
}


export async function getTransactions(page: number, accessToken?: string): ApiPromise<TransactionsResponse> {
    const cacheKey = 'Balance'
    return FetchWToken('status/transactions', cacheKey, accessToken)
}