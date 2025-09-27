import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { setKitchens } from "app/store/slices/global";
import { KitchenRepo } from "core/kitchens/repository/kitchenRepo";
import { Kitchen, KitchenSlice, Status } from "core/kitchens/entities/Kitchen";
import { useCallback, useState } from "react";
import { filterCity } from "./useAllCities";

export interface UseAllKitchens {
  get: () => void;
  byKitchenId: (kitchenId: string) => KitchenSlice | undefined;
  list: KitchenSlice[];
  findOne: (id: string) => void;
  findOneData: Kitchen | undefined;
}

export const useAllKitchens = (): UseAllKitchens => {
  const kitchens = useAppSelector((state) => state.global.kitchens);
  const dispatch = useAppDispatch();
  let loading = false;

  const [findOneItem, setFindOne] = useState<Kitchen>();

  let findOneLoading = false;

  const findOne = (id: string) => {
    if (findOneLoading) return;
    findOneLoading = true;

    KitchenRepo.byId(id)
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
    if (["loading"].includes(kitchens.status)) return;
    if (loading) return;
    loading = true;

    dispatch(setKitchens({ ...kitchens, status: "loading" }));

    KitchenRepo.getAll()
      .then((response) => {
        dispatch(
          setKitchens({
            ...kitchens,
            status: "succeeded",
            data: response
              .filter(
                (kitchen) =>
                  filterCity(kitchen.city.code, kitchen.city.name) &&
                  kitchen.status === Status.ACTIVE
              )
              .map(
                (kitchen) =>
                  ({
                    id: kitchen.id,
                    kitchenId: kitchen.kitchenId,
                    name: kitchen.name,
                    locationCode: kitchen.locationCode,
                    city: kitchen.city.code,
                    address: kitchen.address,
                    country: kitchen.country,
                    type: kitchen.type,
                  } as KitchenSlice)
              ),
          })
        );
      })
      .catch((error) => {
        dispatch(setKitchens({ ...kitchens, status: "failed", error }));
      })
      .finally(() => {
        loading = false;
      });
  };

  const getByKitchenId = useCallback(
    (kitchenId: string) => {
      return kitchens.data.find((kitchen) => kitchen.kitchenId === kitchenId);
    },
    [kitchens]
  );

  return {
    get: getAll,
    byKitchenId: getByKitchenId,
    list: kitchens.data,
    findOne,
    findOneData: findOneItem,
  };
};
