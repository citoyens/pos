import { ApiVersion, getHttp, postHttp } from "utils/http";
import appConfig from "config/app";
import { Menu, MenuByRolePermission } from "../entities/Menu";

const byRole = async (roleCode: string): Promise<Menu[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `menu/by-role/${roleCode}`
    );
    const data = await response.json();
    return data as Menu[];
  } catch (ex: any) {
    console.error(`Error MenuService.byRole | ${ex.message}`);
    return [];
  }
};

const saveByRolePermissions = async (
  data: MenuByRolePermission[]
): Promise<Boolean> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `menu/add-role-permission`,
      data
    );
    const result = await response.text();
    return result === "true";
  } catch (ex: any) {
    console.error(`Error MenuService.saveByRolePermissions | ${ex.message}`);
    return false;
  }
};

export const MenuService = {
  byRole,
  saveByRolePermissions,
};
