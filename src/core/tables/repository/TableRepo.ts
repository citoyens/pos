import { ApiVersion, getHttp, postHttp } from "utils/http";
import { Table } from "../entities/Table";
import appConfig from "config/app";

const url = appConfig.bistroKeeper.apiBaseUrl;

export const getAllTablesByKitchenId = async (
  kitchenId: string
): Promise<Table[]> => {
  try {
    const response = await getHttp(
      url,
      ApiVersion.V1,
      `table/kitchen/${kitchenId}`
    );
    const data = await response.json();
    return data.data as Table[];
  } catch (ex: any) {
    console.error(`Error getAllTablesByKitchenId | ${ex.message}`);
    return [];
  }
};

export const updateTableStatus = async (
  id: string,
  status: string
): Promise<Table> => {
  try {
    const response = await postHttp(url, ApiVersion.V1, `table/status`, {
      id,
      status,
    });
    const data = await response.json();
    return data as Table;
  } catch (ex: any) {
    console.error(`Error updateTableStatus | ${ex.message}`);
    throw ex;
  }
};

export const getTableById = async (id: string): Promise<Table | undefined> => {
  try {
    const response = await getHttp(url, ApiVersion.V1, `table/${id}`);

    if (response.status === 404) return undefined;

    const data = await response.json();
    return data.data as Table;
  } catch (ex: any) {
    console.error(`Error getTableById | ${ex.message}`);
    return undefined;
  }
};
