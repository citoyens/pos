import { User } from "core/users/entities/User";
import { TFunction } from "i18next";
import { isCorporate } from "./areaAndPosition";
import { KOSRowData } from "@foodology-co/alejandria";
import { UseAllCities } from "app/hooks/useAllCities";
import { commons } from "app/i18n/types";

function transformKeys(user: any) {
  return Object.fromEntries(
    Object.entries(user).map(([key, value]) => {
      const transformedKey = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toUpperCase();

      return [transformedKey, value];
    })
  );
}

export const sortUserToCSV = (a: KOSRowData, b: KOSRowData) => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

export const userToCSV = (user: User, useCity: UseAllCities, t: TFunction) => {
  const {
    profile,
    username,
    firstname,
    email,
    lastname,
    country,
    city,
    contract,
    roles,
    createdAt,
    lastUpdatedAt,
    status,
  } = user;
  const { documentNumber, documentType, kitchenId, ...restProfile } = profile;
  const {
    termination,
    area,
    position,
    contractType,
    workingDay,
    ...restContract
  } = contract;

  const role = roles[0] ?? "";

  const result = {
    documentNumber,
    documentType,
    username,
    firstname,
    lastname,
    email,
    country: country ? t(`KOSLocationSelectorLocale.${country}`) : "",
    city: useCity.byCode(city)?.name ?? city,
    kitchenId,
    area,
    position,
    corporate: t(isCorporate(area) ? commons.YES : commons.NO),
    role: role ? t(`KOSRoleLocale.${role}`) : "",
    contractType: contractType ? t(contractType) : "",
    workingDay: workingDay ? t(workingDay) : "",
    ...restProfile,
    ...restContract,
    ...(termination
      ? {
          endDate: termination.date,
          endType: termination.type
            ? t(`retirementTypeLocale.${termination.type}`)
            : "",
          endReason: termination.reason
            ? t(`retirementReasonLocale.${termination.reason}`)
            : "",
        }
      : { endDate: "", endType: "", endReason: "" }),
    status,
    createdAt,
    lastUpdatedAt,
  };
  return transformKeys(result);
};
