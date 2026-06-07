export interface AuthUser {
  name: string;
  email: string;
  bio?: string | null;
  avatar?: {
    url: string;
    alt: string;
  };
  banner?: {
    url: string;
    alt: string;
  };
  venueManager?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: AuthUser & {
    accessToken: string;
  };
  meta: Record<string, never>;
}