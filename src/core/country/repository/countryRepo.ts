import appConfig from "config/app";
import { ApiVersion, getHttp } from "utils/http";
import { CountryResponse } from "../entities/Country";

const getAll = async (): Promise<CountryResponse> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `country/all`
    );
    const data = await response.json();
    return data as CountryResponse;
  } catch (ex: any) {
    console.error(`Error in CountryRepo.getAll | ${ex.message}`);
    return { data: [] };
  }
};

export const CountryRepo = {
  getAll,
};
