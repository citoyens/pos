import { Box, Breadcrumbs, Icon } from "@mui/material";
import { Menu, MenuByRolePermission } from "core/Menu/entities/Menu";
import { ReactElement } from "react";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const menuModifyPermissions = (
  element: PermissionTable,
  current: PermissionTable,
  permissionsByRole: string[]
) => {
  if (element.menuId === current.menuId) {
    return {
      ...element,
      permissions: permissionsByRole,
    };
  }
  return element;
};

const modifyPermissions = (
  menus: PermissionTable[],
  current: PermissionTable,
  permissionsByRole: string[]
): PermissionTable[] =>
  menus.map((el) => menuModifyPermissions(el, current, permissionsByRole));

export interface PermissionTable extends MenuByRolePermission {
  labels: ReactElement[];
  defaultPermissions: string[];
}

const getLabel = (menu: Menu) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {!!menu.icon && <Icon>{menu.icon}</Icon>}
    {menu.name}
  </Box>
);

const forTable = (
  menus: Menu[],
  roleId: string,
  companyCode: string,
  parentLabels: ReactElement[]
): PermissionTable[] => {
  const result: PermissionTable[] = [];

  menus.forEach((menu) => {
    const labels = [...parentLabels];
    labels.push(getLabel(menu));
    const permissions = menu.children.length ? ["VIEW"] : menu.permissions;
    const permissionsByRole = menu.permissionsByRole.filter((el) =>
      permissions.includes(el)
    );
    result.push({
      menuId: menu.id,
      roleId,
      companyCode,
      labels,
      defaultPermissions: permissions,
      permissions: permissionsByRole,
    });

    if (menu.children.length) {
      result.push(...forTable(menu.children, roleId, companyCode, labels));
    }
  });

  return result;
};

const renderLabel = (menu: PermissionTable) => (
  <Breadcrumbs
    separator={<KeyboardArrowRightOutlinedIcon />}
    aria-label="label trail"
  >
    {menu.labels.map((label) => label)}
  </Breadcrumbs>
);

export const MenuUtils = {
  modifyPermissions,
  forTable,
  renderLabel,
};
