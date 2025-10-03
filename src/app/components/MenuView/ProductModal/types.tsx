export type ModEntry = { quantity: number; name: string; price: number };
export type ModifiersState = Record<string, Record<string, ModEntry>>;

export type Option = {
  key: string;
  name: string;
  price: number;
  available: boolean;
};

export type Group = {
  key: string;
  name: string;
  priority: number;
  min: number;
  max: number;
  options: Option[];
};

export type ProductModalProps = {
  selectItem: {
    idItem: string;
    name: string;
    title: string;
    description: string;
    price: number;
    image: string;
    modifiers: any;
    available?: boolean;
    comment?: string;
    storeId?: string;
  };
  onClose: () => void;
  onConfirm: (payload: {
    sku: string;
    quantity: number;
    modifiers: ModifiersState;
    comment?: string;
  }) => void;
};
