import ModuleSelectorPage from "app/pages/ModuleSelector";
import { TypeOfRole as Role, TypeOfRole } from "utils/role";
import KitchenSelector from "app/pages/KitchenSelector";

export interface CustomRoute {
  path: string;
  element?: JSX.Element;
  childrens?: CustomRoute[];
  roles?: TypeOfRole[];
}

export const rolesWithAllAccess = [
  Role.TECH,
  Role.PRODUCTO,
  Role.TECH_OPS,
  Role.PEOPLE,
  Role.NOMINA,
  Role.OPS_EXCELLENTS,
];

export const rolesToApproveOvertime = [
  Role.OPS,
  Role.CITY_MANAGER,
  Role.JEFE_CP,
  Role.MANAGER_CP,
];

export const routeConfig: CustomRoute[] = [
  {
    path: "modules",
    element: <ModuleSelectorPage />,
    childrens: [
      {
        path: ":typeModule",
        element: <ModuleSelectorPage />,
      },
    ],
  },
  {
    path: "kitchen-selector",
    element: <KitchenSelector />,
  },
];
