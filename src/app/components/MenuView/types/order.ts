// src/app/components/MenuView/types/order.ts

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface OrderItem {
  key: string;
  sku: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableName: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
