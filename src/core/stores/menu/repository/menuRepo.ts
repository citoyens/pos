import { ApiVersion, getHttp } from "utils/http";
import { MenuResponse } from "../entities/Menu";
import appConfig from "config/app";

export const getMenu = async (storeId: string): Promise<MenuResponse> => {
  const response = await getHttp(
    appConfig.foodologyPos.apiBaseUrl,
    ApiVersion.V1,
    `store/${storeId}/menu`
  );
  const result = await response.json();
  return result.data as MenuResponse;
};
