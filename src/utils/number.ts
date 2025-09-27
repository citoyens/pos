import { LocaleData } from "./currency";

export const numberFormat = (number: number, localeData: LocaleData) => {
  return number.toLocaleString(localeData.locale);
};

export const removeLeadingZeros = (numberStr: string): string => {
  if (!numberStr || isNaN(Number(numberStr))) return "0";
  const num = parseFloat(numberStr);
  return num.toFixed(numberStr.split(".").at(1)?.length);
};

export const numberWithDecimalsFormat = (
  numberStr: string,
  decimals?: number
): string => {
  if (!numberStr || isNaN(Number(numberStr))) return "0";
  const num = parseFloat(numberStr);
  return num.toFixed(decimals ?? numberStr.split(".").at(1)?.length);
};
