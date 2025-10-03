export type ModifiersState = Record<
  string,
  Record<string, { quantity: number; name: string; price: number }>
>;

export type CartItem = {
  key: string;
  sku: string;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  modifiers?: ModifiersState;
  comment?: string;
};

export interface CartItemForPanel {
  key: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
}
