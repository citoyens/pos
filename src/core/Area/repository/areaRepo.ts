import { ApiVersion, getHttp } from "utils/http";
import appConfig from "config/app";
import { AreaWithPositions } from "../entities/Area";

const withPositionsByCompany = async (): Promise<AreaWithPositions[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `area/with-positions/by-company`
    );

    const data = await response.json();
    return data as AreaWithPositions[];
  } catch (ex: any) {
    console.error(`Error AreaRepo.withPositionsByCompany | ${ex.message}`);
    return [];
  }
};

export const AreaRepo = {
  withPositionsByCompany,
};
