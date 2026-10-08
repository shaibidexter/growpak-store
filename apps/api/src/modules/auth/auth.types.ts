import { UserRoleType } from '@growpak/shared';

export interface TokenPayload {
  sub: string; // User ID
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
}

export interface AuthUserResponse {
  id: string;
  email: string | null;
  phone: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  vendorId?: string;
  storeManagerId?: string;
}

export interface LoginResult {
  user: AuthUserResponse;
  tokens: AuthTokens;
}
