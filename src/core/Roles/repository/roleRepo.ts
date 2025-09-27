import { ApiVersion, getHttp, postHttp } from "utils/http";
import appConfig from "config/app";
import { Role, RoleSeed } from "../entities/Role";

const all = async (): Promise<Role[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `role/all`
    );
    const data = await response.json();
    return data as Role[];
  } catch (ex: any) {
    console.error(`Error RoleRepo.all | ${ex.message}`);
    return [];
  }
};

const byId = async (id: string): Promise<Role | undefined> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `role/id/${id}`
    );

    const data = await response.json();
    return data as Role;
  } catch (ex: any) {
    console.error(`Error RoleRepo.byId | ${ex.message}`);
    return undefined;
  }
};

const upsert = async (body: RoleSeed): Promise<boolean> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `role/upsert`,
      body
    );
    const result = await response.text();
    return result === "true";
  } catch (ex: any) {
    console.error(`Error RoleRepo.upsert | ${ex.message}`);
    return false;
  }
};

export const RoleRepo = {
  upsert,
  byId,
  all,
};
