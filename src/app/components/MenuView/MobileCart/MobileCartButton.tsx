import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { ShoppingBagOutlined as ShoppingBagOutlinedIcon } from "@mui/icons-material";

interface MobileCartButtonProps {
  totalQty: number;
  total: number;
  formatPrice: (price: number) => string;
  onOpen: () => void;
}

export const MobileCartButton: React.FC<MobileCartButtonProps> = ({
  totalQty,
  total,
  formatPrice,
  onOpen,
}) => (
  <Box
    sx={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      p: 2,
      bgcolor: "background.paper",
      borderTop: 1,
      borderColor: "divider",
      boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
      zIndex: 1000,
    }}
  >
    <Button
      fullWidth
      variant="contained"
      size="large"
      startIcon={<ShoppingBagOutlinedIcon />}
      onClick={onOpen}
      disabled={totalQty === 0}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={600}>
          Ver resumen ({totalQty} {totalQty === 1 ? "producto" : "productos"})
        </Typography>
        <Typography fontWeight={700}>{formatPrice(total)}</Typography>
      </Box>
    </Button>
  </Box>
);
