export type UnitNames = Record<string, string>;

export function unitShortNameToUnitName(unitShortName: string): string {
  const unitNames: UnitNames = {
    UN: "Unidad",
    G: "Gramos",
    ML: "Mililitros",
    GR: "Gramos",
    KG: "Kilogramos",
    CX: "CX",
    PCT: "PCT",
  };

  return unitNames[unitShortName];
}
