import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { setCities } from "app/store/slices/global";
import { CityRepo } from "core/city/repository/cityRepo";
import { City } from "core/city/entities/City";
import { useCallback } from "react";

const filter = ["corporativo", "corporate", "test", "prueba"];

export const filterCity = (code: string, name: string, slug?: string) => {
  const toSearch = [code, name];
  if (slug) toSearch.push(slug);
  return !filter.some((el) =>
    toSearch.some((search) => search.toLowerCase().includes(el.toLowerCase()))
  );
};

export interface UseAllCities {
  get: () => void;
  byId: (id: string) => City | undefined;
  byCode: (code: string) => City | undefined;
  byName: (name: string) => City | undefined;
  byCountry: (country: string) => City[];
  list: City[];
}

export const useAllCities = (): UseAllCities => {
  const cities = useAppSelector((state) => state.global.cities);
  const dispatch = useAppDispatch();
  let loading = false;

  const getAll = () => {
    if (["loading"].includes(cities.status)) return;
    if (loading) return;
    loading = true;

    dispatch(setCities({ ...cities, status: "loading" }));

    CityRepo.byCompany()
      .then((response) => {
        dispatch(
          setCities({
            ...cities,
            status: "succeeded",
            data: response.filter((city) =>
              filterCity(city.code, city.name, city.slug)
            ),
          })
        );
      })
      .catch((error) => {
        dispatch(setCities({ ...cities, status: "failed", error }));
      })
      .finally(() => {
        loading = false;
      });
  };

  const getById = useCallback(
    (id: string) => {
      return cities.data.find((city) => city.id === id);
    },
    [cities]
  );

  const getByCode = useCallback(
    (code: string) => {
      return cities.data.find((city) => city.code === code);
    },
    [cities]
  );

  const getByCountry = useCallback(
    (country: string) => {
      return cities.data.filter((city) => city.country === country);
    },
    [cities]
  );

  const getByName = useCallback(
    (name: string) => {
      return cities.data.find((city) => city.name === name);
    },
    [cities]
  );

  return {
    get: getAll,
    byId: getById,
    byCode: getByCode,
    byCountry: getByCountry,
    byName: getByName,
    list: cities.data,
  };
};
