import { ApiVersion, getHttp, postHttp } from "utils/http";
import appConfig from "config/app";
import { DateRange, SetShiftPayload, Shift } from "../entities/Shift";

export const getUnprocessed = async (
  country: string,
  isSuperUser: boolean
): Promise<Shift[]> => {
  try {
    const response = await getHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `shift/unprocessed/${country}/${isSuperUser}`
    );
    const data = await response.json();
    return data as Shift[];
  } catch (ex: any) {
    console.error(`Error getUnprocessed | ${ex.message}`);
    return [];
  }
};

export const byDateRange = async (data: DateRange): Promise<Shift[]> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `shift/date/range`,
      data
    );
    const result = await response.json();
    return result as Shift[];
  } catch (ex: any) {
    console.error(`Error byDateRange | ${ex.message}`);
    return [];
  }
};

export const setShift = async (data: SetShiftPayload): Promise<boolean> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `shift/update`,
      data
    );
    const result = (await response.text()) === "true";
    return result;
  } catch (ex: any) {
    console.error(`Error in setShift: ${ex.message}`);
    return false;
  }
};

export const createExtraHour = async (payload: Shift): Promise<Shift> => {
  try {
    const response = await postHttp(
      appConfig.avatar.apiBaseUrl,
      ApiVersion.V1,
      `shift/create`,
      payload
    );
    const data = await response.json();
    return data;
  } catch (ex: any) {
    console.error(`Error createExtraHour | ${ex.message}`);
    throw ex;
  }
};
