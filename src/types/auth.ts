export interface AuthUser {
    name: string;
    email: string;
    bio: string | null;
    avatar?: {
      url: string;
      alt: string;
    };
    banner?: {
      url: string;
      alt: string;
    };
  }