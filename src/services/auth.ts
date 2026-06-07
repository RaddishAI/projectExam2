import { API_BASE_URL } from "./api";
import type { LoginPayload, LoginResponse } from "../types/auth";
import type { RegisterPayload, RegisterResponse } from "../types/register";

export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
};

/**
 * Registers a new Holidaze user.
 *
 * @param payload User registration data.
 * @returns Newly created user profile.
 * @throws Error when registration fails.
 */
export async function register(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const response = await fetch(AUTH_ENDPOINTS.register, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message ?? "Registration failed");
  }

  return data;
}

/**
 * Logs in an existing Holidaze user.
 *
 * @param payload User login credentials.
 * @returns Logged in user profile with access token.
 * @throws Error when login fails.
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(AUTH_ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message ?? "Login failed");
  }

  return data;
}