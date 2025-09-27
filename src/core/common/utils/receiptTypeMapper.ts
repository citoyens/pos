export type UnitNames = Record<string, string>;

export function receiptTypeMapper(status: string): string {
  const receiptTypeMapper: UnitNames = {
    PURCHASE_ORDER: "Orden de Compra",
    TRANSFER_ORDER: "Traslado",
  };

  return receiptTypeMapper[status];
}
