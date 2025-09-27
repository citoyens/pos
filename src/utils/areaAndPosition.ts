type AreaOrPosition = { [key in string]: string[] };

const fdgyDefaultAreas = [
  "Cocina",
  "Centro de producción",
  "Punto físico",
  "Administración",
  "Supply",
  "Estrategia",
  "Finanzas",
  "Marketing",
  "Operaciones",
  "People",
  "Socios",
  "Tech",
  "Quality",
  "Externo",
];

const fdgyAreas: AreaOrPosition = {
  COL: fdgyDefaultAreas,
  MEX: fdgyDefaultAreas,
  PER: fdgyDefaultAreas,
};

const fdgyPositions: AreaOrPosition = {
  "CENTRO DE PRODUCCIÓN": [
    "Gerente de CP",
    "Lider de CP",
    "Jefe de CP",
    "Jefe de Almacen",
    "Segundo",
    "Auxiliar de cocina",
    "Auxiliar de respostería",
    "Steward",
    "Almacenista",
    "Cocinero innovación",
    "Auxiliar de operaciones",
  ],
  COCINA: [
    "Jefe de cocina",
    "Segundo",
    "Auxiliar de cocina",
    "Auxiliar de pase",
    "Steward",
    "Itamae Junior",
    "Itamae Senior",
    "Rolleador",
  ],
  "PUNTO FÍSICO": [
    "Gerente punto físico",
    "Cajero",
    "Encargado de punto",
    "Auxiliar de pase",
    "Auxiliar de cocina",
  ],
};

export const kitchenPosition = Object.values(fdgyPositions).flat();

export const isCorporate = (area: string): boolean => {
  const noCorporateAreas = [
    "Cocina",
    "Centro de producción",
    "Punto físico",
  ].map((el) => el.toUpperCase());
  const areaRefined = area.toUpperCase();
  const isExterno = areaRefined === "EXTERNO";
  return isExterno ? false : !noCorporateAreas.includes(areaRefined);
};

export const getAreas = (
  companyCode: string,
  country: string
): string[] | undefined => {
  const companies = ["fdgy", "phc"];
  if (companies.includes(companyCode)) {
    return (
      fdgyAreas[country]?.map((el) => el.toUpperCase()) ??
      fdgyDefaultAreas.map((el) => el.toUpperCase())
    );
  }
  return undefined;
};

export const getPositions = (area: string): string[] | undefined => {
  return fdgyPositions[area]?.map((el) => el.toUpperCase());
};
