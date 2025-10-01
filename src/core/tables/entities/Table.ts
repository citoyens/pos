export enum Status {
  IN_USE = "IN_USE",
  RESERVED = "RESERVED",
  VACANT = "VACANT",
  INACTIVE = "INACTIVE",
}

export interface Table {
  id: string;
  name: string;
  companyId: string;
  kitchenId: string;
  floor: string;
  status: string;
  capacity: number;
}
