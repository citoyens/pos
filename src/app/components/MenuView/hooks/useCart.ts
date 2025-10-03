import { useState, useCallback } from "react";
import { CartItem, ModifiersState } from "../types";

export const useCart = () => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});

  const buildModifiersId = (mods?: ModifiersState) => {
    if (!mods) return "";
    const groups = Object.keys(mods).sort();
    const parts: string[] = [];
    for (const g of groups) {
      const keys = Object.keys(mods[g]).sort();
      const seg = keys.map((k) => `${k}:${mods[g][k].quantity ?? 0}`).join(";");
      parts.push(`${g}[${seg}]`);
    }
    return parts.join("|");
  };

  const addToCart = useCallback(
    (
      base: { name: string; price: number; image?: string },
      sku: string,
      mods?: ModifiersState,
      comment?: string,
      quantity = 1
    ) => {
      const idMods = buildModifiersId(mods);
      const key = `${sku}||${base.price}||${idMods}`;
      setCart((prev) => {
        const existing = prev[key];
        if (existing) {
          return {
            ...prev,
            [key]: { ...existing, quantity: existing.quantity + quantity },
          };
        }
        return {
          ...prev,
          [key]: {
            key,
            sku,
            title: base.name,
            price: base.price,
            image: base.image,
            quantity,
            modifiers: mods,
            comment,
          },
        };
      });
    },
    []
  );

  const clearCart = useCallback(() => setCart({}), []);

  const incrementItem = useCallback(
    (key: string) =>
      setCart((prev) => {
        const it = prev[key];
        if (!it) return prev;
        return { ...prev, [key]: { ...it, quantity: it.quantity + 1 } };
      }),
    []
  );

  const decrementItem = useCallback(
    (key: string) =>
      setCart((prev) => {
        const it = prev[key];
        if (!it) return prev;
        if (it.quantity <= 1) {
          const { [key]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [key]: { ...it, quantity: it.quantity - 1 } };
      }),
    []
  );

  return { cart, addToCart, clearCart, incrementItem, decrementItem };
};
