export interface Menu {
  id: string;
  name: string;
  path: string;
  icon: string;
  description?: string;
  permissionsByRole: string[];
  permissions: string[];
  children: Menu[];
}

export interface MenuByRolePermission {
  roleId: string;
  menuId: string;
  permissions: string[];
  companyCode: string;
}

export enum Permission {
  VIEW = "VIEW",
  CREATE = "CREATE",
  EDIT = "EDIT",
  ARCHIVE = "ARCHIVE",
  DOWNLOAD = "DOWNLOAD",
}
