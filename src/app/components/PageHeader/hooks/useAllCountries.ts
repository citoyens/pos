import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { setCountries } from "app/store/slices/global";
import { Country } from "core/country/entities/Country";
import { CountryRepo } from "core/country/repository/countryRepo";
import { useCallback } from "react";

export interface UseAllCountries {
  get: () => void;
  byCode: (code: string) => Country | undefined;
  list: Country[];
}

export const useAllCountries = (): UseAllCountries => {
  const countries = useAppSelector((state) => state.global.countries);
  const dispatch = useAppDispatch();
  let loading = false;

  const getAll = () => {
    if (["loading"].includes(countries.status)) return;
    if (loading) return;
    loading = true;

    dispatch(setCountries({ ...countries, status: "loading" }));

    CountryRepo.getAll()
      .then((response) => {
        dispatch(
          setCountries({
            ...countries,
            status: "succeeded",
            data: response.data,
          })
        );
      })
      .catch((error) => {
        dispatch(setCountries({ ...countries, status: "failed", error }));
      })
      .finally(() => {
        loading = false;
      });
  };

  const getByCode = useCallback(
    (code: string) => {
      return countries.data.find((country) => country.code === code);
    },
    [countries]
  );

  return {
    get: getAll,
    byCode: getByCode,
    list: countries.data,
  };
};
