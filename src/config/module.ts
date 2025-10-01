import {
  modulesLocale,
  userManager,
  shiftManager,
  permissionsByRole,
  userSchedule,
} from "app/i18n/types";
import { Module } from "utils/module";

export const adminModule: Array<Module> = [
  {
    moduleId: "kitchenSelector",
    moduleName: "Seleccionar cocina",
    link: "/kitchen-selector",
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
