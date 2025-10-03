// components/KitchenSelector/index.tsx - ACTUALIZACIÓN
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useAllKitchens } from "app/components/PageHeader/hooks/useAllKitchens";
import { useAllStore } from "app/components/PageHeader/hooks/useAllStore";
import { useAllBrands } from "app/components/PageHeader/hooks/useAllBrands";
import {
  setLocalStorage,
  getLocalStorageJSON,
  LocalStorageItem,
} from "utils/localStorage";
import { Box, Typography } from "@mui/material";
import { Store } from "core/stores/entities/Store";
import { Brand } from "core/brands/entities/Brand";
import { KitchenList } from "./KitchenList";
import { BrandSelector } from "./BrandSelector";
import MenuView from "app/components/MenuView";
import TableSelector from "../TableSelector";

interface StoreWithBrand extends Store {
  fullBrand?: Brand;
}

// CAMBIO: Agregar "menu" al tipo ViewType
type ViewType = "kitchens" | "brands" | "tables" | "menu";

const KitchenSelector: FunctionComponent = () => {
  const { list: kitchens } = useAllKitchens();
  const { getStores, stores, getStoresLoading } = useAllStore();
  const { findOne, findOneData } = useAllBrands();
  const [currentView, setCurrentView] = useState<ViewType>("kitchens");
  const [selectedKitchen, setSelectedKitchen] = useState<string>("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);
  const [storesWithBrands, setStoresWithBrands] = useState<StoreWithBrand[]>(
    []
  );
  const [loadingBrands, setLoadingBrands] = useState(false);

  useEffect(() => {
    const storedKitchen = getLocalStorageJSON(
      "selectedKitche" as LocalStorageItem
    );
    if (
      storedKitchen &&
      typeof storedKitchen === "object" &&
      "kitchenId" in storedKitchen
    ) {
      setSelectedKitchen((storedKitchen as any).kitchenId);
    }

    const storedStore = getLocalStorageJSON(
      "selectedStore" as LocalStorageItem
    );
  }, []);

  const countries = useMemo(
    () => Array.from(new Set(kitchens.map((k) => k.country))).sort(),
    [kitchens]
  );

  const cityOptions = useMemo(() => {
    const base = country
      ? kitchens.filter((k) => k.country === country)
      : kitchens;
    return Array.from(new Set(base.map((k) => k.city))).sort();
  }, [kitchens, country]);

  const norm = (s?: string) =>
    (s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filtered = useMemo(() => {
    return kitchens.filter((k) => {
      if (country && k.country !== country) return false;
      if (cities.length && !cities.includes(k.city)) return false;
      if (search) {
        const q = norm(search);
        const hay =
          norm(k.name).includes(q) ||
          norm(k.address ?? "").includes(q) ||
          norm(k.city).includes(q) ||
          norm(k.kitchenId).includes(q) ||
          norm(k.locationCode).includes(q);
        if (!hay) return false;
      }
      return true;
    });
  }, [kitchens, country, cities, search]);

  const currentKitchen = useMemo(
    () => kitchens.find((k) => k.kitchenId === selectedKitchen),
    [kitchens, selectedKitchen]
  );

  useEffect(() => {
    if (currentKitchen && currentView === "brands") {
      getStores(
        ["Launched"],
        { kitchens: [currentKitchen.kitchenId] },
        "fdgy",
        [],
        ["FoodologyPOS"],
        50,
        0,
        ""
      );
    }
  }, [currentKitchen, currentView]);

  useEffect(() => {
    if (stores.length > 0 && currentView === "brands") {
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
  }, [stores, currentView]);

  useEffect(() => {
    if (findOneData) {
      setStoresWithBrands((prev) => {
        const existingStore = prev.find((s) => s.brand?.id === findOneData.id);

        if (existingStore) {
          return prev;
        }

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

  const uniqueStores = useMemo(() => {
    const unique: StoreWithBrand[] = [];
    const seen = new Set<string>();

    for (const store of storesWithBrands) {
      if (store.brand?.id && !seen.has(store.brand.id)) {
        seen.add(store.brand.id);
        unique.push(store);
      }
    }

    return unique;
  }, [storesWithBrands]);

  const handleSelectKitchen = (kitchenId: string) => {
    const kitchen = kitchens.find((k) => k.kitchenId === kitchenId);
    if (kitchen) {
      setSelectedKitchen(kitchenId);
      setLocalStorage("selectedKitche" as LocalStorageItem, kitchen);
      setStoresWithBrands([]);
      setCurrentView("brands");
    }
  };

  const handleSelectBrand = (store: StoreWithBrand) => {
    setLocalStorage(
      "selectedBrand" as LocalStorageItem,
      store.fullBrand || store.brand
    );
    setLocalStorage("selectedStore" as LocalStorageItem, store);
    setCurrentView("tables");
  };

  const handleBackFromBrands = () => {
    setCurrentView("kitchens");
    setSelectedKitchen("");
    setStoresWithBrands([]);
  };

  const handleBackFromTables = () => {
    setCurrentView("brands");
  };

  // NUEVO: Handler para volver del menú a las mesas
  const handleBackFromMenu = () => {
    setCurrentView("tables");
  };

  // NUEVO: Handler para cuando se selecciona una mesa
  const handleTableSelected = () => {
    setCurrentView("menu");
  };

  if (!kitchens.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Cargando cocinas…
        </Typography>
      </Box>
    );
  }

  // NUEVO: Renderizar MenuView cuando currentView === "menu"
  if (currentView === "menu") {
    return (
      <Box
        id="menu-scroll"
        sx={{
          height: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <MenuView onBack={handleBackFromMenu} />
      </Box>
    );
  }

  if (currentView === "tables") {
    // CAMBIO: Pasar onTableSelected al TableSelector
    return (
      <TableSelector
        onBack={handleBackFromTables}
        onTableSelected={handleTableSelected}
      />
    );
  }

  if (currentView === "brands") {
    return (
      <BrandSelector
        kitchenName={currentKitchen?.name || ""}
        stores={uniqueStores}
        loading={getStoresLoading || loadingBrands}
        onBack={handleBackFromBrands}
        onSelectBrand={handleSelectBrand}
      />
    );
  }

  return (
    <KitchenList
      kitchens={kitchens}
      filteredKitchens={filtered}
      countries={countries}
      country={country}
      setCountry={setCountry}
      cityOptions={cityOptions}
      cities={cities}
      setCities={setCities}
      search={search}
      setSearch={setSearch}
      onSelectKitchen={handleSelectKitchen}
    />
  );
};

export default KitchenSelector;
