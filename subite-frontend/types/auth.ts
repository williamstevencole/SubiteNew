// User roles
export enum UserRole {
  MANAGER = "MANAGER",
  DRIVER = "DRIVER",
  PASSENGER = "PASSENGER",
}

// User status
export enum UserStatus {
  NO_ROUTES = "NO_ROUTES",
  ON_ROUTE = "ON_ROUTE",
  OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

// Auth related types
export interface AuthUser {
  userId: number;
  role: UserRole;
  companyId: number | null;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Login response from API (matches backend response)
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name?: string;
    role: UserRole;
    companyId?: number | null;
  };
}
