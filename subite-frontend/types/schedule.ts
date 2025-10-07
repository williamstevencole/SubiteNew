// Company Schedule attributes
export interface CompanySchedule {
  id: number;
  createdAt: Date;
  companyId?: number;
  time: string;
  scheduleType: ScheduleType;
}

export interface CompanyScheduleCreationAttributes {
  companyId?: number;
  time: string;
  scheduleType: ScheduleType;
}

export enum ScheduleType {
  ARRIVAL = "ARRIVAL",
  DEPARTURE = "DEPARTURE",
}

// User Schedule attributes
export interface UserSchedule {
  id: number;
  createdAt: Date;
  scheduleId: number;
  userId: number;
  dayOfWeek?: DayOfWeek;
}

export interface UserScheduleCreationAttributes {
  scheduleId: number;
  userId: number;
  dayOfWeek?: DayOfWeek;
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
