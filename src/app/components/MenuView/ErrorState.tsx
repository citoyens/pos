import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Alert,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

interface ErrorStateProps {
  error: string;
  onBack: () => void;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onBack,
  onRetry,
}) => (
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
          Error
        </Typography>
      </Toolbar>
    </AppBar>
    <Box sx={{ py: 4, px: { xs: 2, md: 3 } }}>
      <Alert severity="error">
        {error}
        <Button sx={{ ml: 2 }} onClick={onRetry}>
          Reintentar
        </Button>
      </Alert>
    </Box>
  </Box>
);
