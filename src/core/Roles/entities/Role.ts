export interface RoleSeed {
  id?: string;
  name: string;
  companyId: string;
  status: string;
  fullAccess: boolean;
}

export interface Role {
  id: string;
  name: string;
  companyId: string;
  status: string;
  fullAccess: boolean;
}
