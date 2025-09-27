import {
  anyValueToString,
  LocalStorageItem as LocalStorageItemAlejandria,
} from "@foodology-co/alejandria";

export enum LocalStorageItemExtra {
  remoteConfig = "remoteConfig",
  filtersConfig = "filtersConfig",
}

export type LocalStorageItem = `${
  | LocalStorageItemAlejandria
  | LocalStorageItemExtra}`;

export const setLocalStorage = (
  item: LocalStorageItem,
  value: unknown
): void => {
  localStorage.setItem(item, anyValueToString(value));
};

export const getLocalStorage = (
  item: LocalStorageItem,
  defaultValue?: string
): string | undefined => {
  return localStorage.getItem(item) ?? defaultValue;
};

export const getLocalStorageString = (
  item: LocalStorageItem,
  defaultValue?: string
): string => {
  return getLocalStorage(item) ?? defaultValue ?? "";
};

export const getLocalStorageNumber = (
  item: LocalStorageItem,
  defaultValue?: number
): number => {
  return Number(getLocalStorage(item) ?? defaultValue ?? 0);
};

export const getLocalStorageBoolean = (
  item: LocalStorageItem,
  defaultValue?: boolean
): boolean => {
  const result = getLocalStorage(item) ?? defaultValue ?? false;
  return String(result) === "true";
};

export const getLocalStorageJSON = (
  item: LocalStorageItem,
  defaultValue?: unknown
): unknown => {
  try {
    return JSON.parse(
      getLocalStorageString(item, anyValueToString(defaultValue))
    );
  } catch (e) {
    return undefined;
  }
};

export const removeLocalStorage = (item: LocalStorageItem): void => {
  localStorage.removeItem(item);
};
