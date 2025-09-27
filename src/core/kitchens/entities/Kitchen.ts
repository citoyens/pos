export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum TypeOfKitchen {
  PRODUCTION_CENTER = "PRODUCTION_CENTER",
  KITCHEN = "KITCHEN",
  BOTH = "BOTH",
}

export type KitchenType = `${TypeOfKitchen}`;

export interface Protocol {
  name: string;
  value: number;
}

export interface ActiveOrders {
  inStation: number;
  total: number;
  inWaitingForDelivery: number;
  inPacking: number;
  isLate: number;
  isLateRT: number;
}

export interface Coord {
  lat: number;
  lng: number;
}

export interface Coords {
  location?: Coord;
  low: Coord[];
  medium: Coord[];
  high: Coord[];
}

export interface AlegraKitchenConfig {
  numberTemplate: string;
}

export interface AwiseAddress {
  neighborhood?: string;
  cep: string;
  municipalCode?: string;
  ufCode?: string;
  streetName?: string;
  municipalName?: string;
  streetNumber?: string;
  ufAcronym?: string;
}

export interface AwisePaymentConfig {
  cash: string;
  credit: string;
  debit: string;
}

export interface AwiseKitchenConfig {
  branch: string;
  payment: AwisePaymentConfig;
  address: AwiseAddress;
  cnpj: string;
  stateRegistration?: string;
  stateRegistrationIndicator?: string;
}

export interface BillingConfig {
  awise?: AwiseKitchenConfig;
  alegra?: AlegraKitchenConfig;
}

export interface KitchenCity {
  _id: string;
  name: string;
  code: string;
}

export interface Kitchen {
  id: string;
  kitchenId: string;
  name: string;
  locationCode?: string;
  status: Status;
  tier: number;
  protocols: Protocol[];
  address: string;
  activeOrders: ActiveOrders;
  country: string;
  billing: BillingConfig;
  city: KitchenCity;
  peopleActive: number;
  polygons: Record<string, Coords>;
  cityIdDidi: string;
  type: KitchenType;
  slug: string;
  latestTurnAt: Date;
  rappiAlliesPassword?: string;
  rappiAlliesUser?: string;
}

export interface KitchenSlice {
  id: string;
  kitchenId: string;
  name: string;
  country: string;
  locationCode: string;
  city: string;
  address: string | null;
  type: KitchenType;
}
