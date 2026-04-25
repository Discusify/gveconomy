export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: number;
}

export type ProfileInformation = {
    displayname: string,
    username: string,
    verified_at: string,
    created_at: string,
    profile_type: string,
    avatar_url: string
}

export type SessionProfile = {
  username: string;
  displayname: string;
  avatar_url: string;
};
export type Transaction = {
  from_username: string,
  to_username: string,
  amount: string,
  created_at: string,
  from_wallet: string,
  to_wallet: string,
}

export type TransactionsResponse = {
  page: number,
  limit: number,
  data: Transaction[]
}
export type ApiPromise<T> = Promise<ApiResponse<T>>