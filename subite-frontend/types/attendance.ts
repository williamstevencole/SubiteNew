// Attendance attributes (formerly RouteAttendance)
export interface Attendance {
  id: number;
  createdAt: Date;
  tripId: number;
  userId: number;
  boarded: boolean;
  boardedAt?: Date;
  boardedLatitude?: number;
  boardedLongitude?: number;
  droppedAt?: Date;
  droppedLatitude?: number;
  droppedLongitude?: number;
}

export interface AttendanceCreationAttributes {
  tripId: number;
  userId: number;
  boarded?: boolean;
  boardedAt?: Date;
  boardedLatitude?: number;
  boardedLongitude?: number;
  droppedAt?: Date;
  droppedLatitude?: number;
  droppedLongitude?: number;
}
