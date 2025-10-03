import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface LoadingStateProps {
  onBack: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ onBack }) => (
  <Box sx={{ minHeight: "100vh" }}>
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
          Cargando menú…
        </Typography>
      </Toolbar>
    </AppBar>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <CircularProgress />
    </Box>
  </Box>
);
