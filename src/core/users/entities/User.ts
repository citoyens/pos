import { CoreBaseResponse } from "core/common/interfaces/core";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  createdAt: Date;
  username: string;
  companyId: string;
  email: string;
  profile: Profile;
  contract: Contract;
  lastUpdatedAt: Date;
  roles: string[];
  country: string;
  city: string;
  status: Status;
  lastUpdatedBy: ModifierUser;
}

export interface UserChangeStatus {
  id: string;
  status: Status;
  startOrEndDate: string;
  endType: string;
  endReason: string;
}

export interface NewUserResponse {
  success: boolean;
  errorCode?: string;
}

export interface NewUserPayload {
  email: string;
  firstname: string;
  lastname: string;
  identification: string;
  area: string;
  position: string;
  costCenter: string;
  kitchenId?: string;
  phoneNumber: string;
  birthday: string;
  genre: Genre;
  documentType: string;
  country?: string;
  city: string;
  contractType: ContractType;
  workingDay?: WorkingDay;
  startDate: string;
  startDateCurrent: string;
  endDate?: string;
  roles: string[];
}

export interface ModifierUser {
  id: string;
  name: string;
}

export interface Profile {
  kitchenId: string;
  phoneNumber: string;
  documentType: string;
  documentNumber: string;
  birthday: string;
  genre: Genre;
}

export interface Termination {
  date: string;
  type: string;
  reason: string;
}

export interface Contract {
  area: string;
  position: string;
  contractType?: ContractType;
  workingDay?: WorkingDay;
  costCenter: string;
  startDate?: string;
  startDateCurrent?: string;
  termination?: Termination;
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum Role {
  ADMIN = "ADMIN",
  QUALITY = "QUALITY",
  CITY_MANAGER = "CITY_MANAGER",
  COCINERO = "COCINERO",
  JEFE_COCINA = "JEFE_COCINA",
  COMPRAS = "COMPRAS",
  CONTABILIDAD = "CONTABILIDAD",
  COUNTRY_MANAGER = "COUNTRY_MANAGER",
  DATA = "DATA",
  ESTRATEGIA = "ESTRATEGIA",
  FINANZAS = "FINANZAS",
  HITS = "HITS",
  MARKETING = "MARKETING",
  OPS = "OPS",
  PEOPLE = "PEOPLE",
  PRODUCTO = "PRODUCTO",
  SOCIOS = "SOCIOS",
  TORRE = "TORRE",
  TECH = "TECH",
  NEW_VERTICALS = "NEW_VERTICALS",
  NOMINA = "NOMINA",
  EXPANSION = "EXPANSION",
  EXTERNAL = "EXTERNAL",
  FRANCHISE = "FRANCHISE",
  CATALOGUE = "CATALOGUE",
  TECH_OPS = "TECH_OPS",
  SOPORTE_CLIENTE = "SOPORTE_CLIENTE",
  OPS_EXCELLENTS = "OPS_EXCELLENTS",
  JEFE_CP = "JEFE_CP",
  COCINERO_CP = "COCINERO_CP",
  STORER = "STORER",
  INVENTORY_ANALYST = "INVENTORY_ANALYST",
  QUALITY_INNOVATION = "QUALITY_INNOVATION",
  SEGUNDO_COCINA = "SEGUNDO_COCINA",
  SEGUNDO_CP = "SEGUNDO_CP",
  MANAGER_CP = "MANAGER_CP",
  JEFE_ALMACEN = "JEFE_ALMACEN",
}

export enum Genre {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum ContractType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
  EXTERNAL = "EXTERNAL",
}

export enum WorkingDay {
  FULL = "FULL",
  PARTIAL = "PARTIAL",
  WEEKEND = "WEEKEND",
}

export function mapUserToNewUserPayload(user: Partial<User>): NewUserPayload {
  const now = new Date().toISOString().split("T")[0];
  return {
    email: user.email ?? "",
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    identification: user.profile?.documentNumber ?? "",
    area: user.contract?.area ?? "",
    position: user.contract?.position ?? "",
    costCenter: user.contract?.costCenter ?? "",
    kitchenId: user.profile?.kitchenId ?? "",
    phoneNumber: user.profile?.phoneNumber ?? "",
    birthday: user.profile?.birthday ?? "",
    genre: user.profile?.genre ?? Genre.MALE,
    documentType: user.profile?.documentType ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    workingDay: user.contract?.workingDay ?? WorkingDay.FULL,
    contractType: user.contract?.contractType ?? ContractType.DIRECT,
    startDate: user.contract?.startDate ?? now,
    startDateCurrent: user.contract?.startDateCurrent ?? now,
    endDate: user.contract?.termination?.date,
    roles: user.roles ?? [],
  };
}

export interface UserLite {
  _id: string;
  username: string;
  name: string;
  kitchenId: string;
  area: string;
  position: string;
  workingDay: string;
}

export interface UserSchedule {
  name: string;
  startTime?: string;
  endTime?: string;
  totalHours: number;
  type: string;
}

export interface UserScheduleDTO {
  _id: string;
  userId: string;
  date: string;
  locationId: string;
  userDocument: string;
  userName: string;
  schedule: UserSchedule;
}

export interface UserScheduleConfig {
  _id: string;
  companyId: string;
  country: string;
  maxHoursPerWeek: number;
  maxHoursPerDay: number;
  maxExtraHoursPerDay: number;
  maxExtraHoursPerWeek: number;
  definedSchedules: UserSchedule[];
}

export interface UserScheduleResponse extends CoreBaseResponse {
  data?: UserScheduleDTO[]
}

export interface UserSchedulePayload {
  userId: string;
  date: string;
  locationId: string;
  datesOfWeek: string[];
  schedule: UserSchedule;
}

export interface UserScheduleConfigResponse extends CoreBaseResponse {
  data?: UserScheduleConfig
}
