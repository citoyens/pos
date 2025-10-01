import appConfig from "config/app";
import { ApiVersion, getHttp } from "utils/http";
import { Brand } from "../entities/Brand";

export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `brand/all`
    );
    const data = await response.json();
    return data.data as Brand[];
  } catch (ex: any) {
    console.error(`Error getting all brands | ${ex.message}`);
    return [] as Brand[];
  }
};

export const brandsByCountry = async (country: string): Promise<Brand[]> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `brand/country/${country}`
    );
    const data = await response.json();
    return data.data as Brand[];
  } catch (ex: any) {
    console.error(`Error getting brands by country | ${ex.message}`);
    return [] as Brand[];
  }
};

export const getBrand = async (brandId: string): Promise<Brand | undefined> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `brand/${brandId}`
    );
    const data = await response.json();
    return data.data as Brand;
  } catch (ex: any) {
    console.error(`Error in getBrand | ${ex.message}`);
    return undefined;
  }
};

export const getBrandById = async (
  brandId: string
): Promise<Brand | undefined> => {
  try {
    const response = await getHttp(
      appConfig.bistroKeeper.apiBaseUrl,
      ApiVersion.V1,
      `brand/brand-id/${brandId}`
    );
    const data = await response.json();
    return data.data as Brand;
  } catch (ex: any) {
    console.error(`Error in getBrandById | ${ex.message}`);
    return undefined;
  }
};
