// Vehicle attributes from database (updated schema)
export interface Vehicle {
  id: number;
  createdAt: Date;
  name: string;
  driverId?: number;
  plate: string;
  active: boolean;
  companyId: number;
  maxCapacity: number;
  photoUrl?: string;
}

// Vehicle creation attributes
export interface VehicleCreationAttributes {
  name: string;
  driverId?: number;
  plate: string;
  active?: boolean;
  companyId: number;
  maxCapacity: number;
  photoUrl?: string;
}
