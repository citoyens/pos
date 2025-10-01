import { FunctionComponent } from "react";
import { Grid, Paper, TextField, Autocomplete, Chip } from "@mui/material";

interface KitchenFiltersProps {
  countries: string[];
  country: string | null;
  setCountry: (country: string | null) => void;
  cityOptions: string[];
  cities: string[];
  setCities: (cities: string[]) => void;
  search: string;
  setSearch: (search: string) => void;
}

export const KitchenFilters: FunctionComponent<KitchenFiltersProps> = ({
  countries,
  country,
  setCountry,
  cityOptions,
  cities,
  setCities,
  search,
  setSearch,
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={countries}
            value={country}
            onChange={(_, v) => {
              setCountry(v);
              setCities([]);
            }}
            renderInput={(params) => <TextField {...params} label="País" />}
            clearOnEscape
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <Autocomplete
            multiple
            options={cityOptions}
            value={cities}
            onChange={(_, v) => setCities(v)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip {...getTagProps({ index })} label={option} size="small" />
              ))
            }
            renderInput={(params) => <TextField {...params} label="Ciudades" />}
            disabled={!cityOptions.length}
            clearOnEscape
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
