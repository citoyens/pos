import appConfig from "config/app";
import { ApiVersion, getHttp } from "../../../utils/http";
import { Company } from "../entities/Company";

const byCode = async (code: string): Promise<Company | undefined> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `company/by-code/${code}`
    );
    const result = await response.json();
    return result as Company;
  } catch (ex: any) {
    console.error(`Error CompanyRepo.byCode | ${ex.message}`);
    return undefined;
  }
};

export const CompanyRepo = {
  byCode,
};
