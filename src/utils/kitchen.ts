import { User } from "core/account/entities/User";
import { KitchenSlice } from "core/kitchens/entities/Kitchen";
import { City } from "core/city/entities/City";
import { Country } from "core/country/entities/Country";

export const cpLabel = "PRODUCTION_CENTER";

export const countriesOptions = (kitchens: Array<KitchenSlice>) => {
  return [...new Set(kitchens.map((kitchen) => kitchen.country))];
};

export const getCitiesOptions = (
  cities: City[],
  selectedCountry?: Country
): City[] => {
  if (!selectedCountry) return [];

  return [
    ...new Set(cities.filter((city) => city.country === selectedCountry.code)),
  ];
};

export const getLocationsOptionsByCity = (
  kitchens: Array<KitchenSlice>,
  selectedCity?: City
) => {
  if (!selectedCity) return [];

  return kitchens
    .filter((kitchen) => selectedCity.code === kitchen.city)
    .sort((a, b) => (a.type === cpLabel ? -1 : 1));
};

export const getLocationsOptionsByCountry = (
  kitchens: Array<KitchenSlice>,
  selectedCountry?: Country
) => {
  if (!selectedCountry) return [];

  return kitchens
    .filter((kitchen) => selectedCountry.code.includes(kitchen.country))
    .sort((a, b) => (a.type === cpLabel ? -1 : 1));
};

interface FilterKitchensByUser {
  kitchens: Array<KitchenSlice>;
  country?: string;
}

export const filterKitchensByUser = (
  user: User,
  kitchens: Array<KitchenSlice>
): FilterKitchensByUser => {
  const kitchenId = user.profile?.kitchenId;
  if (!kitchenId) {
    return { kitchens };
  }
  const country = kitchens.find(
    (kitchen) => kitchen.kitchenId === kitchenId
  )?.country;

  const kitchensFiltered = kitchens.filter(
    (kitchen) => kitchen.country === country
  );

  return { kitchens: kitchensFiltered, country };
};

const allLabel = "ALL";
