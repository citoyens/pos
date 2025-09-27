import {
  getCookieConfig,
  CookieItem as CookieItemAlejandria,
} from "@foodology-co/alejandria";
import appConfig from "config/app";
import Cookies from "js-cookie";

export enum CookieItemExtra {}

export type CookieItem = `${CookieItemAlejandria | CookieItemExtra}`;

export const setCookie = (item: CookieItem, value: string): void => {
  const cookieConfig = getCookieConfig(appConfig.env);
  Cookies.set(`${cookieConfig.env}.${item}`, value, cookieConfig.options);
};

export const getCookie = (item: CookieItem): string | undefined => {
  const cookieConfig = getCookieConfig(appConfig.env);
  return Cookies.get(`${cookieConfig.env}.${item}`);
};

export const removeCookie = (item: CookieItem): void => {
  const cookieConfig = getCookieConfig(appConfig.env);
  Cookies.remove(`${cookieConfig.env}.${item}`, cookieConfig.options);
};

export const removeAllAlejandriaCookies = () => {
  if (appConfig.env === "development") return;
  Object.values(CookieItemAlejandria).forEach((key) => removeCookie(key));
};
