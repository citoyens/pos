import React from "react";
import {
  Drawer,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import {
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteOutline as DeleteOutlineIcon,
} from "@mui/icons-material";
import { CartItemForPanel } from "../types";

interface MobileCartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItemForPanel[];
  totalQty: number;
  total: number;
  formatPrice: (price: number) => string;
  onClearCart: () => void;
  onIncrementItem: (key: string) => void;
  onDecrementItem: (key: string) => void;
  onContinue: () => void;
}

export const MobileCartDrawer: React.FC<MobileCartDrawerProps> = ({
  open,
  onClose,
  items,
  totalQty,
  total,
  formatPrice,
  onClearCart,
  onIncrementItem,
  onDecrementItem,
  onContinue,
}) => (
  <Drawer
    anchor="bottom"
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: { borderRadius: "16px 16px 0 0", maxHeight: "85vh" },
    }}
  >
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: 2, bgcolor: "primary.main", color: "white" }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <ShoppingBagOutlinedIcon />
        <Typography fontWeight={700}>Resumen del pedido</Typography>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 700,
            width: 32,
            height: 32,
          }}
        >
          {totalQty}
        </Avatar>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </Stack>

    <Box sx={{ p: 2, maxHeight: "50vh", overflowY: "auto" }}>
      {items.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          El carrito está vacío
        </Typography>
      ) : (
        <Stack spacing={2}>
          {items.map((item) => (
            <Box
              key={item.key}
              sx={{
                display: "flex",
                gap: 2,
                p: 1.5,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              {item.image && (
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    objectFit: "cover",
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatPrice(item.unitPrice)}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <IconButton
                    size="small"
                    onClick={() => onDecrementItem(item.key)}
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography fontWeight={600}>{item.quantity}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => onIncrementItem(item.key)}
                    sx={{ bgcolor: "background.paper" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
              <Typography variant="body1" fontWeight={700}>
                {formatPrice(item.lineTotal)}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>

    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>Subtotal</Typography>
          <Typography fontWeight={600}>{formatPrice(total)}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            Total
          </Typography>
          <Typography variant="h6" fontWeight={700} color="primary">
            {formatPrice(total)}
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={1}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onContinue}
          disabled={totalQty === 0}
        >
          Continuar
        </Button>
        {totalQty > 0 && (
          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<DeleteOutlineIcon />}
            onClick={onClearCart}
            color="error"
          >
            Vaciar carrito
          </Button>
        )}
      </Stack>
    </Box>
  </Drawer>
);
