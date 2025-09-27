import {
  modulesLocale,
  userManager,
  shiftManager,
  permissionsByRole,
  userSchedule,
} from "app/i18n/types";
import { Module } from "utils/module";

export enum LocationType {
  CP = "PCENTER",
  KITCHEN = "KITCHEN",
}

export const adminModule: Array<Module> = [
  {
    moduleId: "userModule",
    moduleName: userManager.TITLE,
    link: "/users",
  },
  {
    moduleId: "usersSchedule",
    moduleName: userSchedule.TITLE,
    link: "/users/schedule",
  },
  {
    moduleId: "permissionsByRole",
    moduleName: permissionsByRole.TITLE,
    link: "/access",
  },
  {
    moduleId: "shiftsModule",
    moduleName: shiftManager.TITLE,
    link: "/shifts",
  },
];

export const modules: Array<Module> = [
  {
    moduleId: "adminModule",
    moduleName: modulesLocale.ADMIN_TITLE,
    description: modulesLocale.ADMIN_SUBTITLE,
    submodules: adminModule,
  },
];
