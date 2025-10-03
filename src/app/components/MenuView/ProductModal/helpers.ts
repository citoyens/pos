import { Group, ModifiersState } from "./types";

export const currency = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

export const buildGroups = (productWithChildren: any): Group[] => {
  const children = productWithChildren?.children ?? {};
  return Object.values(children)
    .map((g: any) => ({
      key: g.name,
      name: g.name,
      priority: g.priority ?? 0,
      min: g?.quantity?.min ?? 0,
      max: g?.quantity?.max ?? 0,
      options: Object.entries(g?.children ?? {}).map(
        ([optKey, opt]: [string, any]) => ({
          key: optKey,
          name: opt?.name ?? optKey,
          price: opt?.price ?? 0,
          available: opt?.available !== false,
        })
      ),
    }))
    .sort((a, b) => a.priority - b.priority);
};

export const areAllModifiersSelected = (
  groups: Group[],
  modifiers: ModifiersState
) => {
  if (groups.length === 0) return true;
  const important = groups.filter((g) => g.min > 0);
  return important.every((g) => {
    const values = Object.values(modifiers[g.name] ?? {});
    const qty = values.reduce((acc, it: any) => acc + (it.quantity ?? 0), 0);
    return g.min <= qty && qty <= g.max;
  });
};

export const isAdjustmentNeeded = (
  groups: Group[],
  modifiers: ModifiersState
) =>
  groups.some((g) => {
    const values = Object.values(modifiers[g.name] ?? {});
    const total = values.reduce(
      (sum: number, v: any) => sum + (v.quantity ?? 0),
      0
    );
    return total < g.min;
  });

export const calculateTypographyMessage = (
  modifiers: ModifiersState,
  groups: Group[]
) =>
  groups
    .filter((g) => {
      const values = Object.values(modifiers[g.name] ?? {});
      const total = values.reduce(
        (sum: number, v: any) => sum + (v.quantity ?? 0),
        0
      );
      return total < g.min;
    })
    .map((g) => g.name)
    .join(", ");
