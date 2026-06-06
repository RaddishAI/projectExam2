import type { AuthUser } from "./auth";

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    venueManager: boolean;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    venueManager: boolean;
}

export interface RegisterResponse {
    data: AuthUser;
    meta: Record<string, never>;
}