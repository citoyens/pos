import appConfig from "config/app";
import { ApiVersion, getHttp, postHttp } from "utils/http";
import { PaginatedStores, Store, StoreQuery } from "../entities/Store";

export const storesByQuery = async (
  query: StoreQuery
): Promise<PaginatedStores> => {
  try {
    const response = await postHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `stores/query`,
      query
    );
    const result: PaginatedStores = await response.json();
    return result;
  } catch (ex: any) {
    console.error(`Error getPurchaseOrders | ${ex.message}`);
    return { list: [], totalItems: 0 };
  }
};

export const storeFindOne = async (
  id: string,
  extraParams?: string
): Promise<Store> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `store/${id}/get`,
      undefined,
      extraParams
    );
    const result = await response.json();
    return result.data as Store;
  } catch (ex: any) {
    console.error(`Error storeFindOne | ${ex.message}`);
    throw ex;
  }
};
