import { API_BASE_URL } from "./api";
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