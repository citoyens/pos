import appConfig from "config/app";
import { ApiVersion, getHttp } from "utils/http";
import { City } from "../entities/City";

const byCompany = async (): Promise<City[]> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `city/company`
    );
    const data = await response.json();
    return data.data as City[];
  } catch (ex: any) {
    console.error(`Error in CityRepo.byCompany | ${ex.message}`);
    return [];
  }
};

export const CityRepo = {
  byCompany,
};
