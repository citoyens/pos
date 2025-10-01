import { KOSRowData } from "@foodology-co/alejandria";

export interface StoreQuery {
  params: Param;
  select: string[];
  cursor: Cursor;
  sort?: Order;
}

export interface Order {
  field: string;
  direction: string;
}

export enum StoreAvailabilityOperation {
  Upcoming = "Upcoming",
  Launched = "Launched",
  Terminated = "Terminated",
}

export type StoreAvailabilityOperationType = `${StoreAvailabilityOperation}`;

export enum StoreStatus {
  Upcoming = "Upcoming",
  Launched = "Launched",
  Paused = "Paused",
  Terminated = "Terminated",
}

export type StoreStatusType = `${StoreStatus}`;

export enum StoreStatus2 {
  OPEN = "OPEN",
  TEMP_CLOSED = "TEMP_CLOSED",
  NOT_LAUNCHED = "NOT_LAUNCHED",
  PERM_CLOSED = "PERM_CLOSED",
}

export interface LocationParam {
  kitchens?: string[];
  kitchen?: string;
  cities?: string[];
  city?: string;
  country?: string;
}

export interface Param {
  ownerId?: string;
  include: StoreStatusType[];
  location?: LocationParam;
  companyId: string;
  brands: string[];
  platforms: string[];
  operationType?: string;
  searchByTerm: string;
  group?: Group;
}

export interface Cursor {
  page: number;
  limit: number;
}

export interface PaginatedStores {
  list: Store[];
  totalItems: number;
  next?: StoreQuery;
}

export interface StoreOnline {
  planned: boolean;
  remote: boolean;
}

export interface StoreAvailability {
  operation: StoreAvailabilityOperationType;
  paused?: boolean;
}

export interface Store {
  id: string;
  ownerId: string;
  brand: any;
  externalId: string;
  kitchenId: string;
  platform: string;
  country: string;
  city: string;
  availability: StoreAvailability;
  online: StoreOnline;
  data: any;
  tags: any;
  kitchen?: kitchenData;
  companyId: string;
  group?: Group;
}

export interface Group {
  id: string;
  name: string;
}

export interface kitchenData {
  id?: string;
  name?: string;
}
