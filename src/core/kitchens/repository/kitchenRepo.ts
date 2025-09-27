import appConfig from "config/app";
import { ApiVersion, getHttp } from "utils/http";
import { Kitchen } from "../entities/Kitchen";

const getAll = async (): Promise<Kitchen[]> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `kitchen/all`
    );
    const data = await response.json();
    return data.data as Kitchen[];
  } catch (ex: any) {
    console.error(`Error in KitchenRepo.getAll | ${ex.message}`);
    return [];
  }
};

const byId = async (id: string): Promise<Kitchen | undefined> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `kitchen/${id}`
    );
    const data = await response.json();
    return data.data as Kitchen;
  } catch (ex: any) {
    console.error(`Error in KitchenRepo.byId | ${ex.message}`);
    return undefined;
  }
};

export const KitchenRepo = {
  byId,
  getAll,
};
