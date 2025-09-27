import { WorkingDay } from "core/users/entities/User";

export interface Shift {
  id?: string;
  userId: string;
  identification: string;
  name: string;
  hours: number;
  kitchenId: string;
  city: string;
  active: boolean;
  roleId: string;
  position: string;
  maxHours: number;
  clientAddress?: string;
  deviceInfo?: string;
  country?: string;
  timeZone: string;
  hourReport: Hour[];
  extraHourReport?: Hour[];
  closedBySystem?: boolean;
  closedBySystemNotificated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  notify?: boolean;
  startTime: Date;
  endTime?: Date;
  companyId: string;
  totalExtras: number;
  reason?: Reason;
  toPay?: ToPay;
  opsManager?: string;
  isHoliday: boolean;
  workingDay?: WorkingDay;
}

export interface Hour {
  type: string;
  total: number;
  typeCode: string;
  isExtra?: boolean;
  toPay?: boolean;
  additional: boolean;
}
export interface DateRange {
  startTime: Date;
  endTime: Date;
}

export enum Reason {
  PEAK_HOURS = "PEAK_HOURS",
  STORE_CLOSING_TASKS = "STORE_CLOSING_TASKS",
  COVERS_INCAPACITY = "COVERS_INCAPACITY",
  TRAINING = "TRAINING",
  LACK_OF_STAFF = "LACK_OF_STAFF",
  BACKLOG_TASKS = "BACKLOG_TASKS",
  SCHEDULED_FOR_HIGH_DEMAND_DAY = "SCHEDULED_FOR_HIGH_DEMAND_DAY",
  INVENTORY_CLOSURE = "INVENTORY_CLOSURE",
  UNCLOSED_SHIFT = "UNCLOSED_SHIFT",
  LUNCH_TIME_OVERTIME = "LUNCH_TIME_OVERTIME",
  EXTRA_SHIFT_IN_ANOTHER_KITCHEN = "EXTRA_SHIFT_IN_ANOTHER_KITCHEN",
}

export interface SetShiftPayload {
  id: string;
  toPay: ToPay;
  opsManager: string;
  reason: Reason;
  extraHourReport: Hour[];
}

export enum ToPay {
  YES = "YES",
  NO = "NO",
  COMPENSATED = "COMPENSATED",
}

export enum HourType {
  SUNDAY_DAYTIME = "SUNDAY_DAYTIME",
  HOLIDAY_DAYTIME = "HOLIDAY_DAYTIME",
  ORDINARY_DAYTIME = "ORDINARY_DAYTIME",
  SUNDAY_NIGHTTIME = "SUNDAY_NIGHTTIME",
  HOLIDAY_NIGHTTIME = "HOLIDAY_NIGHTTIME",
  ORDINARY_NIGHTTIME = "ORDINARY_NIGHTTIME",
}

export const hourTypeLabelsES: Record<HourType, string> = {
  [HourType.SUNDAY_DAYTIME]: "Hora extra dominical diurna",
  [HourType.HOLIDAY_DAYTIME]: "Hora extra festiva diurna",
  [HourType.ORDINARY_DAYTIME]: "Horas extra diurna",
  [HourType.SUNDAY_NIGHTTIME]: "Hora extra dominical nocturna",
  [HourType.HOLIDAY_NIGHTTIME]: "Hora extra festiva nocturna",
  [HourType.ORDINARY_NIGHTTIME]: "Horas extra nocturna",
};
