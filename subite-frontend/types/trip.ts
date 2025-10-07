// Trip (formerly DailyRoute) attributes from database
export interface Trip {
  id: number;
  companyScheduleId: number;
  companyId: number;
  date: string; // DATEONLY
  driverId: number;
  vehicleId: number;
  status: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
}

// Trip creation attributes
export interface TripCreationAttributes {
  companyScheduleId: number;
  companyId: number;
  date: string;
  driverId: number;
  vehicleId: number;
  status?: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
}

// Trip status enum
export enum TripStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Trip Position (GPS Tracking)
export interface TripPosition {
  id: number;
  tripId: number;
  latitude: number;
  longitude: number;
  speed?: number; // km/h
  heading?: number; // degrees (0-360)
  accuracy?: number; // meters
  timestamp: Date;
}

export interface TripPositionCreationAttributes {
  tripId: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  timestamp?: Date;
}
