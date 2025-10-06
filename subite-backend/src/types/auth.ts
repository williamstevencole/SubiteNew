export enum UserRole {
  MANAGER = "MANAGER",
  DRIVER = "DRIVER",
  PASSENGER = "PASSENGER",
}

export interface AuthUser {
  userId: number;
  role: UserRole;
  companyId: number | null;
  email: string;
}

export interface JWTPayload {
  sub: string;
  role: UserRole;
  companyId?: string;
  email: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}