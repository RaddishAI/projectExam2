import type { AuthUser } from "../types/auth";

const ACCESS_TOKEN_KEY = "holidaze_access_token";
const USER_KEY = "holidaze_user";

/**
 * Stores the logged in user's access token and profile.
 *
 * @param accessToken User access token.
 * @param user User profile data.
 */
export function saveAuth(accessToken: string, user: AuthUser) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Removes stored authentication data.
 */
export function clearAuth() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
 * Gets the stored access token.
 *
 * @returns Stored access token or null.
 */
export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
 * Gets the stored user profile.
 *
 * @returns Stored user profile or null.
 */
export function getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
  
    if (!user) {
      return null;
    }
  
    return JSON.parse(user) as AuthUser;
  }