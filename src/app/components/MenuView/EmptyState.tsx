import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon, Storefront } from "@mui/icons-material";
import { StoreSelector } from "./StoreSelector";

interface EmptyStateProps {
  onBack: () => void;
  onStoreChange: (storeId: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onBack,
  onStoreChange,
}) => (
  <Box sx={{ minHeight: "100vh", bgcolor: "#F5F7FA" }}>
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2 }}>
          Sin productos
        </Typography>
      </Toolbar>
    </AppBar>

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "primary.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Storefront sx={{ fontSize: 40, color: "primary.main" }} />
            </Box>

            <Stack spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                No hay productos disponibles
              </Typography>
              <Typography align="center" color="text.secondary" variant="body2">
                Este menú no tiene productos en este momento. Prueba seleccionar
                otra marca.
              </Typography>
            </Stack>

            <Box sx={{ width: "100%", pt: 2 }}>
              <StoreSelector onStoreChange={onStoreChange} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
