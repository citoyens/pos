// src/app/components/MenuView/utils/orderManager.ts

import { Order, OrderStatus } from "../types/order";
import {
  getLocalStorageJSON,
  setLocalStorage,
  LocalStorageItem,
} from "utils/localStorage";

const ORDERS_KEY = "activeOrders" as LocalStorageItem;

export const orderManager = {
  getAllOrders(): Order[] {
    const orders = getLocalStorageJSON(ORDERS_KEY);
    return Array.isArray(orders) ? orders : [];
  },

  getOrderByTableId(tableId: string): Order | undefined {
    const orders = this.getAllOrders();
    return orders.find(
      (order) =>
        order.tableId === tableId &&
        order.status !== OrderStatus.COMPLETED &&
        order.status !== OrderStatus.CANCELLED
    );
  },

  createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order {
    const orders = this.getAllOrders();

    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    setLocalStorage(ORDERS_KEY, orders);

    return newOrder;
  },

  updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    const orders = this.getAllOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) return null;

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setLocalStorage(ORDERS_KEY, orders);
    return orders[orderIndex];
  },

  completeOrder(orderId: string): Order | null {
    return this.updateOrder(orderId, { status: OrderStatus.COMPLETED });
  },

  cancelOrder(orderId: string): Order | null {
    return this.updateOrder(orderId, { status: OrderStatus.CANCELLED });
  },

  deleteOrder(orderId: string): boolean {
    const orders = this.getAllOrders();
    const filtered = orders.filter((o) => o.id !== orderId);

    if (filtered.length === orders.length) return false;

    setLocalStorage(ORDERS_KEY, filtered);
    return true;
  },
};
