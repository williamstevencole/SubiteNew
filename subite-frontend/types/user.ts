import { UserRole, UserStatus } from './auth';

// User attributes from database (updated schema)
export interface User {
  id: number;
  createdAt: Date;
  name?: string;
  phone?: string;
  email?: string;
  passwordHash?: string;
  role?: UserRole;
  status: UserStatus;
  notificationId?: string;
  companyId?: number;
  qrCode?: string;
  photoUrl?: string;
}

// User creation attributes
export interface UserCreationAttributes {
  name?: string;
  phone?: string;
  email?: string;
  passwordHash?: string;
  role?: UserRole;
  status?: UserStatus;
  notificationId?: string;
  companyId?: number;
  qrCode?: string;
  photoUrl?: string;
}
