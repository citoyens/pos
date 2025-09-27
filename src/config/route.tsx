import ModuleSelectorPage from "app/pages/ModuleSelector";
import ModuleUsers from "app/pages/Users";
import ModuleShifts from "app/pages/Shifts";
import ModuleRoles from "app/pages/Roles";
import { TypeOfRole as Role, TypeOfRole } from "utils/role";
import UserSchedulePage from "app/pages/Users/Schedule";

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
    path: "users",
    element: <ModuleUsers />,
    childrens: [{ path: "schedule", element: <UserSchedulePage /> }],
  },
  {
    path: "access",
    element: <ModuleRoles />,
  },
  {
    path: "shifts",
    element: <ModuleShifts />,
    roles: rolesToApproveOvertime,
  },
];
