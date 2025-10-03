// src/app/components/MenuView/StoreSelector.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useAllStore } from "app/components/PageHeader/hooks/useAllStore";
import { useAllBrands } from "app/components/PageHeader/hooks/useAllBrands";
import {
  getLocalStorageJSON,
  setLocalStorage,
  LocalStorageItem,
} from "utils/localStorage";
import { Store } from "core/stores/entities/Store";
import { Brand } from "core/brands/entities/Brand";

interface StoreWithBrand extends Store {
  fullBrand?: Brand;
}

interface StoreSelectorProps {
  onStoreChange: (storeId: string) => void;
}

export const StoreSelector: React.FC<StoreSelectorProps> = ({
  onStoreChange,
}) => {
  const { getStores, stores, getStoresLoading } = useAllStore();
  const { findOne, findOneData } = useAllBrands();
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storesWithBrands, setStoresWithBrands] = useState<StoreWithBrand[]>(
    []
  );
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    const store = getLocalStorageJSON("selectedStore" as LocalStorageItem);
    const kitchen = getLocalStorageJSON("selectedKitche" as LocalStorageItem);

    setSelectedStore(store);

    if (kitchen && typeof kitchen === "object" && "kitchenId" in kitchen) {
      getStores(
        ["Launched"],
        { kitchens: [(kitchen as any).kitchenId] },
        "fdgy",
        [],
        ["FoodologyPOS"],
        50,
        0,
        ""
      );
    }
  }, []);

  useEffect(() => {
    if (stores.length > 0) {
      setLoadingBrands(true);
      const uniqueBrandIds = Array.from(
        new Set(stores.map((store) => store.brand?.id).filter(Boolean))
      );

      const fetchBrands = async () => {
        for (const brandId of uniqueBrandIds) {
          findOne(brandId);
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      };

      fetchBrands().finally(() => setLoadingBrands(false));
    }
  }, [stores]);

  useEffect(() => {
    if (findOneData) {
      setStoresWithBrands((prev) => {
        const existingStore = prev.find((s) => s.brand?.id === findOneData.id);
        if (existingStore) return prev;

        const matchingStore = stores.find(
          (s) => s.brand?.id === findOneData.id
        );
        if (matchingStore) {
          return [...prev, { ...matchingStore, fullBrand: findOneData }];
        }
        return prev;
      });
    }
  }, [findOneData, stores]);

  const handleStoreSelect = (store: StoreWithBrand) => {
    setSelectedStore(store);
    setLocalStorage("selectedStore" as LocalStorageItem, store);
    setLocalStorage(
      "selectedBrand" as LocalStorageItem,
      store.fullBrand || store.brand
    );
    onStoreChange(store.id);
  };

  if (getStoresLoading || loadingBrands) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!storesWithBrands.length || storesWithBrands.length === 1) {
    return null;
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
          Cambiar menú
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 48px)",
            gap: 1.5,
          }}
        >
          {storesWithBrands.map((store) => {
            const logoUrl = store.fullBrand?.logoUrl;
            const brandName = store.fullBrand?.name || store.brand?.name;

            return (
              <Tooltip key={store.id} title={brandName} arrow>
                <Avatar
                  src={logoUrl}
                  alt={brandName}
                  onClick={() => handleStoreSelect(store)}
                  sx={{
                    width: 48,
                    height: 48,
                    cursor: "pointer",
                    border: "3px solid",
                    borderColor:
                      selectedStore?.id === store.id
                        ? "primary.main"
                        : "transparent",
                    transition: "all 0.2s",
                    bgcolor: "grey.200",
                    "&:hover": {
                      borderColor: "primary.main",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {!logoUrl && brandName?.charAt(0)}
                </Avatar>
              </Tooltip>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
