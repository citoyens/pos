import { modules } from "config/module";
import { ObjectParams } from "./http";
import { TypeOfRole } from "./role";
import { getRoutePaths, refineLink } from "./route";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export type Module = {
  moduleId: string;
  moduleName: string;
  description?: string;
  link?: string;
  locationType?: string;
  submodules?: Module[];
};

const getLink = (link?: string): string => {
  if (!link?.includes(":locationType")) {
    return `/:locationType${link}`;
  }
  return link ?? "";
};

export const refineModules = (role: TypeOfRole): Module[] => {
  if (!role) return [];
  const result: Module[] = [];
  const links = getRoutePaths([], role);
  modules.forEach((module: Module) => {
    const submodules: Module[] = [];
    module.submodules?.forEach((submodule: Module) => {
      const link = getLink(submodule.link);
      const validate = links.includes(link);
      if (validate) {
        submodules.push({ ...submodule, link });
      }
    });
    if (submodules.length) {
      result.push({ ...module, submodules });
    }
  });
  return result;
};

export const getModuleLink = (module: string) => {
  const link = `/modules/${module}`;
  switch (module) {
    default:
      return link;
  }
};

export const getNavs = (
  navs: Module[],
  role: TypeOfRole,
  location: string,
  params: ObjectParams,
  modules?: Module[],
  locationType?: string
): Module[] => {
  const modulesTmp = modules ?? refineModules(role);
  const pathname = location.replace(/%20/g, " ");
  let ended = false;

  modulesTmp.forEach((module) => {
    const paramsRefined = {
      ...(!params ? {} : params),
      locationType: locationType ?? module.locationType,
    } as ObjectParams;
    if (!!module.submodules?.length && !navs.length) {
      getNavs(
        navs,
        role,
        pathname,
        paramsRefined,
        module.submodules,
        paramsRefined["locationType"]
      );
    }
    const link = module.link
      ? refineLink(module.link, paramsRefined)
      : getModuleLink(module.moduleId);
    if (navs.length && !ended) {
      navs.push({ moduleId: "", moduleName: module.moduleName, link });
      ended = true;
    }
    if (pathname === link && !ended) {
      navs.push({ moduleId: "", moduleName: module.moduleName, link });
      ended = true;
    }
  });

  return modules ? navs : navs.reverse();
};

export interface ModuleResume {
  titles: string[];
  path: string;
}

export const getModuleResume = (): ModuleResume[] => {
  const result: ModuleResume[] = [];
  modules.forEach((module) => {
    module.submodules?.forEach((submodule) => {
      result.push({
        titles: [module.moduleName, submodule.moduleName],
        path: submodule.link ?? "",
      });
    });
  });
  return result;
};

export const getModuleIcon = (
  moduleId: string
): React.ReactElement | undefined => {
  switch (moduleId) {
    case "userModule":
      return <PersonRoundedIcon fontSize="large" />;
    case "roleModule":
      return <SecurityRoundedIcon fontSize="large" />;
    case "shiftsModule":
      return <AccessTimeRoundedIcon fontSize="large" />;
    case "permissionsByRole":
      return <LockOpenOutlinedIcon fontSize="large" />;
    case "usersSchedule":
      return <CalendarMonthOutlinedIcon fontSize="large" />
    default:
      return undefined;
  }
};
