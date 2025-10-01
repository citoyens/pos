export interface MenuItem {
  name: string;
  priority: number;
  children: Record<string, MenuItem> | object;
  available?: boolean;
  price?: number;
  quantity?: {
    min: number;
    max: number;
  };
}

export interface MenuResponse {
  menu: MenuData;
  store: Store;
}

export interface MenuData {
  children?: Record<string, MenuItem>;
  name: string;
  priority: number;
  quantity: {
    min: number;
    max: number;
  };
  description: string;
  image: {
    url: string;
  };
  price: number;
}

export interface Product {
  children: Record<string, Product>;
  name: string;
  price: number;
  image: {
    url: string;
  };
  description: string;
  modifiers?: Modifier;
  comment?: string;
  storeId?: string;
  available: boolean;
}

export interface SelectItem {
  name: string;
  storeId: string;
  price: number;
  idItem: string;
  image: string;
  title: string;
  description: string;
  comment: string;
  modifiers: MenuItem;
  available: boolean;
}

export interface Modifier {
  name: string;
  quantity: number;
  price: number;
}

export interface Store {
  id: string;
  brandId: string;
  kitchen: string;
  kitchenId: string;
  country: string;
  schedule: {
    timeZone: string;
    week: WeeklySchedule;
  };
}

export interface WeeklySchedule {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}
