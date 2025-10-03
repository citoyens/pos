import {
  DEFAULT_LOCATION_TYPE,
  KITCHEN_ID_KEY,
  KITCHEN_ID_KEY_EQUALS,
  LOCATION_TYPE_KEY,
} from "app/components/PageHeader/hooks/useNavigator";
import { Buffer } from "buffer";
import { rolesWithAllAccess, routeConfig } from "config/route";
import React from "react";
import { Route } from "react-router-dom";
import { ObjectParams } from "./http";
import { ModuleResume, getModuleResume } from "./module";
import { TypeOfRole } from "./role";
import { anyValueToString } from "@foodology-co/alejandria";

export interface CustomRoute {
  path: string;
  element?: JSX.Element;
  childrens?: CustomRoute[];
  roles?: TypeOfRole[];
}

export interface AllCustomRoute {
  titles: string[];
  path: string;
  roles: string[];
}

export const allCustomRoutes = (
  list: AllCustomRoute[],
  routes?: CustomRoute[],
  prefixPath?: string,
  modules?: ModuleResume[]
) => {
  const routesTmp = routes ?? routeConfig;
  const prefix = prefixPath ? `${prefixPath}/` : "";
  const modulesTmp = modules ?? getModuleResume();
  routesTmp.forEach((route) => {
    if (route.childrens?.length) {
      allCustomRoutes(
        list,
        route.childrens,
        `${prefix}${route.path}`,
        modulesTmp
      );
    }
    if (!route.element) return;
    const path = `/${prefix}${route.path}`;
    const titles = modulesTmp.find((el) => el.path.includes(path))?.titles ?? [
      "--",
    ];
    const roles = route.roles
      ? Array.from(new Set([...rolesWithAllAccess, ...route.roles]))
      : ["ALL"];
    list.push({ titles, path, roles });
  });
};

export const customRoutes = (
  routesToRender: React.ReactElement[],
  role: TypeOfRole,
  routes?: CustomRoute[],
  prefixPath?: string
) => {
  const routesTmp = routes ?? routeConfig;
  const prefix = prefixPath ? `${prefixPath}/` : "";
  routesTmp.forEach((route) => {
    if (route.childrens?.length) {
      customRoutes(
        routesToRender,
        role,
        route.childrens,
        `${prefix}${route.path}`
      );
    }
    if (!route.element) return;
    let validRole = true;
    if (route.roles) {
      validRole =
        route.roles.includes(role) || rolesWithAllAccess.includes(role);
    }
    if (!validRole) return;
    const path = `/${prefix}${route.path}`;
    if (
      !path.includes(":locationType") &&
      !path.includes(DEFAULT_LOCATION_TYPE)
    ) {
      const path2 = `/:locationType${path}`;
      routesToRender.push(
        <Route key={path2} path={path2} element={route.element} />
      );
    } else {
      routesToRender.push(
        <Route key={path} path={path} element={route.element} />
      );
    }
  });
};

export const getRoutePaths = (
  pathsToReturn: string[],
  role: TypeOfRole,
  routes?: CustomRoute[],
  prefixPath?: string
): string[] => {
  const routesTmp = routes ?? routeConfig;
  const prefix = prefixPath ? `${prefixPath}/` : "";
  routesTmp.forEach((route) => {
    if (route.childrens?.length) {
      getRoutePaths(
        pathsToReturn,
        role,
        route.childrens,
        `${prefix}${route.path}`
      );
    }
    if (!route.element) return;
    let validRole = true;
    if (route.roles) {
      validRole =
        route.roles.includes(role) || rolesWithAllAccess.includes(role);
    }
    if (!validRole) return;
    const path = `/${prefix}${route.path}`;
    if (
      !path.includes(":locationType") &&
      !path.includes(DEFAULT_LOCATION_TYPE)
    ) {
      pathsToReturn.push(`/:locationType${path}`);
    } else {
      pathsToReturn.push(path);
    }
  });
  return pathsToReturn;
};

export const refineLink = (link: string, params?: ObjectParams): string => {
  let result = link;
  if (
    !result.includes(LOCATION_TYPE_KEY) &&
    !result.includes(DEFAULT_LOCATION_TYPE) &&
    !result.includes("http")
  ) {
    result = `/:${LOCATION_TYPE_KEY}${result}`;
  }
  if (params) {
    Object.keys(params).forEach((key) => {
      if (!params[key]) return;
      if (key === KITCHEN_ID_KEY) {
        KITCHEN_ID_KEY_EQUALS.forEach((equal) => {
          result = result.replace(`:${equal}`, params[key]);
        });
      }
      result = result.replace(`:${key}`, params[key]);
    });
    result = result.replace(`:${LOCATION_TYPE_KEY}`, DEFAULT_LOCATION_TYPE);
  }
  return result;
};

export const setHash = (value: unknown) => {
  const hash = anyValueToString(value);
  window.location.hash = Buffer.from(hash).toString("base64");
};

export const getHash = (): string => {
  const hash = window.location.hash.replace("#", "");
  return Buffer.from(hash, "base64").toString("ascii");
};

export const getHashJSON = (): unknown => {
  try {
    return JSON.parse(getHash());
  } catch (e) {
    return undefined;
  }
};
