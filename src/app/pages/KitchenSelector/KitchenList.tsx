import { FunctionComponent } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { KitchenCard } from "./KitchenCard";
import { KitchenFilters } from "./KitchenFilters";
import { KitchenSlice } from "core/kitchens/entities/Kitchen";

interface KitchenListProps {
  kitchens: KitchenSlice[];
  filteredKitchens: KitchenSlice[];
  countries: string[];
  country: string | null;
  setCountry: (country: string | null) => void;
  cityOptions: string[];
  cities: string[];
  setCities: (cities: string[]) => void;
  search: string;
  setSearch: (search: string) => void;
  onSelectKitchen: (kitchenId: string) => void;
}

export const KitchenList: FunctionComponent<KitchenListProps> = ({
  kitchens,
  filteredKitchens,
  countries,
  country,
  setCountry,
  cityOptions,
  cities,
  setCities,
  search,
  setSearch,
  onSelectKitchen,
}) => {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" align="center">
        Selecciona una cocina
      </Typography>

      <KitchenFilters
        countries={countries}
        country={country}
        setCountry={setCountry}
        cityOptions={cityOptions}
        cities={cities}
        setCities={setCities}
        search={search}
        setSearch={setSearch}
      />

      <Typography variant="body2">
        {filteredKitchens.length} de {kitchens.length} cocinas
      </Typography>

      <Grid container spacing={2}>
        {filteredKitchens.map((kitchen) => (
          <Grid item xs={12} sm={6} md={4} key={kitchen.kitchenId}>
            <KitchenCard kitchen={kitchen} onSelect={onSelectKitchen} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
