import { rolesWithAllAccess } from "config/route";

export enum TypeOfRole {
  ADMIN = "ADMIN",
  QUALITY = "QUALITY",
  CITY_MANAGER = "CITY_MANAGER",
  COCINERO = "COCINERO",
  JEFE_COCINA = "JEFE_COCINA",
  COMPRAS = "COMPRAS",
  CONTABILIDAD = "CONTABILIDAD",
  COUNTRY_MANAGER = "COUNTRY_MANAGER",
  DATA = "DATA",
  ESTRATEGIA = "ESTRATEGIA",
  FINANZAS = "FINANZAS",
  HITS = "HITS",
  MARKETING = "MARKETING",
  OPS = "OPS",
  PEOPLE = "PEOPLE",
  PRODUCTO = "PRODUCTO",
  SOCIOS = "SOCIOS",
  TORRE = "TORRE",
  TECH = "TECH",
  NEW_VERTICALS = "NEW_VERTICALS",
  NOMINA = "NOMINA",
  EXPANSION = "EXPANSION",
  EXTERNAL = "EXTERNAL",
  FRANCHISE = "FRANCHISE",
  CATALOGUE = "CATALOGUE",
  TECH_OPS = "TECH_OPS",
  SOPORTE_CLIENTE = "SOPORTE_CLIENTE",
  OPS_EXCELLENTS = "OPS_EXCELLENTS",
  JEFE_CP = "JEFE_CP",
  COCINERO_CP = "COCINERO_CP",
  STORER = "STORER",
  INVENTORY_ANALYST = "INVENTORY_ANALYST",
  SEGUNDO_COCINA = "SEGUNDO_COCINA",
  SEGUNDO_CP = "SEGUNDO_CP",
  QUALITY_INNOVATION = "QUALITY_INNOVATION",
  MANAGER_CP = "MANAGER_CP",
}

export const isSuperRole = (role?: TypeOfRole): boolean => {
  return role ? rolesWithAllAccess.includes(role) : false;
};

export const canProductionSchedule = (role?: TypeOfRole): boolean => {
  const validator = [TypeOfRole.JEFE_CP, TypeOfRole.SEGUNDO_CP, TypeOfRole.OPS];
  return role ? validator.includes(role) : false;
};

export const canProductionScheduleOnlyView = (role?: TypeOfRole): boolean => {
  const validator = [TypeOfRole.QUALITY, TypeOfRole.QUALITY_INNOVATION];
  return role ? validator.includes(role) : false;
};

export const isKitchenRol = (role?: TypeOfRole): boolean => {
  const validator = [
    TypeOfRole.COCINERO,
    TypeOfRole.COCINERO_CP,
    TypeOfRole.JEFE_CP,
    TypeOfRole.SEGUNDO_CP,
    TypeOfRole.JEFE_COCINA,
    TypeOfRole.SEGUNDO_COCINA,
  ];
  return role ? validator.includes(role) : false;
};
