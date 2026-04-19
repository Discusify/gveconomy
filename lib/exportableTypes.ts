export interface ApiResponse<T> {
  data?: T;
  error?: string;
  code?: number;
}

export type ProfileInformation = {
    displayname: string,
    username: string,
    verified_at: string,
    created_at: string
}