import { useMemo } from "react";
import { CartItem, ModifiersState } from "../types";

export const useCartCalculations = (cart: Record<string, CartItem>) => {
  const sumModifiersUnitPrice = (mods?: ModifiersState) => {
    if (!mods) return 0;
    let extra = 0;
    for (const g of Object.keys(mods)) {
      for (const k of Object.keys(mods[g])) {
        const opt = mods[g][k];
        extra += (opt.price ?? 0) * (opt.quantity ?? 0);
      }
    }
    return extra;
  };

  const cartTotals = useMemo(() => {
    let totalQty = 0;
    let total = 0;
    Object.values(cart).forEach((item) => {
      const unit = item.price + sumModifiersUnitPrice(item.modifiers);
      totalQty += item.quantity;
      total += unit * item.quantity;
    });
    return { totalQty, total };
  }, [cart]);

  const cartItemsForPanel = useMemo(
    () =>
      Object.values(cart).map((item) => {
        const unit = item.price + sumModifiersUnitPrice(item.modifiers);
        return {
          key: item.key,
          title: item.title,
          quantity: item.quantity,
          unitPrice: unit,
          lineTotal: unit * item.quantity,
          image: item.image,
        };
      }),
    [cart]
  );

  return { cartTotals, cartItemsForPanel, sumModifiersUnitPrice };
};
