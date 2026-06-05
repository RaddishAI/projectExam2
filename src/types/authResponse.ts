import type { AuthUser } from "./auth";

export interface AuthResponse {
    data: AuthUser;
    accessToken: string;
}