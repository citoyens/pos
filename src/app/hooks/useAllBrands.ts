import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { setBrands } from "app/store/slices/global";
import { getAllBrands, getBrand } from "core/brands/repository/brandRepo";
import { Brand, BrandSlice, Status } from "core/brands/entities/Brand";
import { useCallback, useState } from "react";

export interface UseAllBrands {
  get: () => void;
  byBrandId: (brandId: string) => BrandSlice | undefined;
  list: BrandSlice[];
  findOne: (id: string) => void;
  findOneData: Brand | undefined;
}

export const useAllBrands = (): UseAllBrands => {
  const brands = useAppSelector((state) => state.global.brands);
  const dispatch = useAppDispatch();
  let loading = false;

  const [findOneItem, setFindOne] = useState<Brand>();

  let findOneLoading = false;

  const findOne = (id: string) => {
    if (findOneLoading) return;
    findOneLoading = true;

    getBrand(id)
      .then((response) => {
        response && setFindOne(response);
      })
      .catch(() => {
        setFindOne(undefined);
      })
      .finally(() => {
        findOneLoading = false;
      });
  };

  const getAll = () => {
    if (["loading"].includes(brands.status)) return;
    if (loading) return;
    loading = true;

    dispatch(setBrands({ ...brands, status: "loading" }));

    getAllBrands()
      .then((response) => {
        dispatch(
          setBrands({
            ...brands,
            status: "succeeded",
            data: response
              .filter((brand) => brand.status === Status.ACTIVE)
              .map(
                (brand) =>
                  ({
                    id: brand.id,
                    name: brand.name,
                    brandId: brand.brandId,
                    countries: brand.countries,
                  } as BrandSlice)
              ),
          })
        );
      })
      .catch((error) => {
        dispatch(setBrands({ ...brands, status: "failed", error }));
      })
      .finally(() => {
        loading = false;
      });
  };

  const getByBrandId = useCallback(
    (brandId: string) => {
      return brands.data.find((brand) => brand.brandId === brandId);
    },
    [brands]
  );

  return {
    get: getAll,
    byBrandId: getByBrandId,
    list: brands.data,
    findOne,
    findOneData: findOneItem,
  };
};
