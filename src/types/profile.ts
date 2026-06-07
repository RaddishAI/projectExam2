import type { AuthUser } from "./auth";

export interface UpdateAvatarPayload {
  avatar: {
    url: string;
    alt: string;
  };
}

export interface UpdateProfileResponse {
  data: AuthUser;
  meta: Record<string, never>;
}