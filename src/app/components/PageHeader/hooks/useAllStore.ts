import {
  Group,
  LocationParam,
  Order,
  Store,
  StoreStatusType,
} from "core/stores/entities/Store";
import { storeFindOne, storesByQuery } from "core/stores/repository/storeRepo";
import { useState } from "react";

export interface UseStore {
  findOne: (id: string, params?: string) => void;
  findOneData: Store | undefined;
  getStores: (
    statuses: StoreStatusType[],
    location: LocationParam,
    companyId: string,
    brands: string[],
    platforms: string[],
    limit: number,
    page: number,
    searchByTerm: string,
    operationType?: string,
    order?: Order,
    group?: Group
  ) => void;
  getStoresLoading: boolean;
  stores: Store[];

  totalItems?: number;
  defaultSelect: string[];
}

export const useAllStore = (): UseStore => {
  const [findOneItem, setFindOne] = useState<Store>();

  let findOneLoading = false;

  const findOne = (id: string, params?: string) => {
    if (findOneLoading) return;
    findOneLoading = true;

    storeFindOne(id, params)
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

  const [stores, setStores] = useState<Store[]>([]);
  const [totalItems, setTotalItems] = useState<number>();
  const [getStoresLoading, setGetStoresLoading] = useState<boolean>(false);
  let loading = false;

  const defaultSelect = [
    "legacy_config",
    "legacy_schedule",
    "statusReason",
    "isPriority",
  ];
  const getStores = (
    statuses: StoreStatusType[],
    location: LocationParam,
    companyId: string,
    brands: string[],
    platforms: string[],
    limit: number,
    page: number,
    searchByTerm: string,
    operationType?: string,
    order?: Order,
    group?: Group
  ) => {
    if (loading) return;
    loading = true;
    setGetStoresLoading(true);

    storesByQuery({
      cursor: { limit: limit, page: page },
      params: {
        include: statuses,
        location,
        companyId,
        brands,
        platforms,
        operationType,
        searchByTerm,
        group: group,
      },
      select: [
        "legacy_config",
        "legacy_schedule",
        "statusReason",
        "isPriority",
      ],
      sort: order,
    })
      .then((response) => {
        setStores(response.list);
        setTotalItems(response.totalItems);
      })
      .catch(() => {
        setStores([]);
      })
      .finally(() => {
        loading = false;
        setGetStoresLoading(false);
      });
  };

  return {
    findOne,
    findOneData: findOneItem,
    getStores,
    getStoresLoading,
    stores,

    totalItems,
    defaultSelect,
  };
};
