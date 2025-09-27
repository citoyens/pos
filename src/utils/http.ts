import appConfig from "config/app";
import { Session } from "core/account/entities/Session";
import { getLoginUrl, getSession } from "./session";
import { getUserLogOut } from "core/account/repositories/http/user";

export enum ApiVersion {
  API = "/api/",
  V1 = "/api/v1/",
}

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
}

const getHeaders = (session: Session, url: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-user-id": session.userId,
  };

  headers["x-auth-token"] = session.token;

  if (!url.includes(appConfig.kitchenDisplay.url)) {
    headers["x-token"] = session.token;
    headers["kos-accountid"] = "0";
    headers["Kos-companyid"] = session.companyId;
    headers["Authorization"] = `Bearer ${session.authorization}`;
  }

  return headers;
};

export const unauthorized = async (url: string) => {
  if (!url.includes(appConfig.kitchenDisplay.url)) {
    await getUserLogOut();
  }
  const redirect = getLoginUrl();
  window.location.href = redirect;
};

export const http = async (
  url: string,
  method: HttpMethod,
  body?: any
): Promise<Response> => {
  const session = getSession();
  const response = await fetch(url, {
    method,
    headers: getHeaders(session, url),
    body: body ? JSON.stringify(body) : undefined,
  });
  if ([401].includes(response.status)) {
    await unauthorized(url);
  }
  return response;
};

export interface ObjectParams {
  [key: string]: string;
}

export const getHttp = async (
  baseUrl: string | null,
  apiVersion: ApiVersion,
  path: string,
  params: ObjectParams = {},
  extraParams?: string
) => {
  const url = `${baseUrl}${apiVersion}${path}`;
  const extra = Object.keys(params).map((key) => `${key}=${params[key]}`);
  extraParams && extra.push(extraParams);
  return await http(`${url}?${extra.join("&")}`, HttpMethod.GET);
};

export const postHttp = async (
  baseUrl: string | null,
  apiVersion: ApiVersion,
  path: string,
  body?: any
) => {
  return await http(`${baseUrl}${apiVersion}${path}`, HttpMethod.POST, body);
};
