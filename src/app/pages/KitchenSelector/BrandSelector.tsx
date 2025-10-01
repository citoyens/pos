import { FunctionComponent } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BrandCard } from "./BrandCard";
import { Store } from "core/stores/entities/Store";
import { Brand } from "core/brands/entities/Brand";

interface StoreWithBrand extends Store {
  fullBrand?: Brand;
}

interface BrandSelectorProps {
  kitchenName: string;
  stores: StoreWithBrand[];
  loading: boolean;
  onBack: () => void;
  onSelectBrand: (store: StoreWithBrand) => void;
}

export const BrandSelector: FunctionComponent<BrandSelectorProps> = ({
  kitchenName,
  stores,
  loading,
  onBack,
  onSelectBrand,
}) => {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5">Selecciona una marca</Typography>
          <Typography variant="body2" color="text.secondary">
            {kitchenName}
          </Typography>
        </Box>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {stores.map((store) => (
            <Grid item key={store.id}>
              <BrandCard store={store} onSelect={onSelectBrand} />
            </Grid>
          ))}
        </Grid>
      )}

      {stores.length === 0 && !loading && (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay marcas disponibles para esta cocina
        </Typography>
      )}
    </Box>
  );
};
