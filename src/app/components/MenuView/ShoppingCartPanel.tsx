// src/app/components/MenuView/ShoppingCartPanel.tsx
import React from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import { ShoppingBag as ShoppingBagIcon } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";

type CartLine = {
  key: string;
  title: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image?: string;
};

interface ShoppingCartPanelProps {
  items: CartLine[];
  totalQuantity: number;
  formatPrice: (price: number) => string;
  onClearCart: () => void;
  onIncrementItem: (key: string) => void;
  onDecrementItem: (key: string) => void; // si llega a 0, el contenedor debe eliminar la línea
  onContinue: () => void;
  total: number;
}

const QtyStepper: React.FC<{
  qty: number;
  onInc: () => void;
  onDec: () => void;
  disabled?: boolean;
}> = ({ qty, onInc, onDec, disabled }) => {
  const isIncEnabled = !disabled;
  const isDecEnabled = !disabled && qty > 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minWidth: "4rem",
        border: "1px solid #A5A8AC",
        borderRadius: "8px",
        px: "3px",
        height: "30px",
        mr: "10px",
        userSelect: "none",
      }}
    >
      <Box
        onClick={isDecEnabled ? onDec : undefined}
        sx={{
          cursor: isDecEnabled ? "pointer" : "not-allowed",
          fontSize: 20,
          lineHeight: 1,
          px: 0.5,
        }}
      >
        −
      </Box>
      <Typography sx={{ mx: "6px", minWidth: 14, textAlign: "center" }}>
        {qty}
      </Typography>
      <Box
        onClick={isIncEnabled ? onInc : undefined}
        sx={{
          cursor: isIncEnabled ? "pointer" : "not-allowed",
          fontSize: 20,
          lineHeight: 1,
          px: 0.5,
          opacity: isIncEnabled ? 1 : 0.4,
        }}
      >
        +
      </Box>
    </Box>
  );
};

export const ShoppingCartPanel: React.FC<ShoppingCartPanelProps> = ({
  items,
  totalQuantity,
  formatPrice,
  onClearCart,
  onIncrementItem,
  onDecrementItem,
  onContinue,
  total,
}) => {
  const hasItems = items && items.length > 0;

  return (
    <Box sx={{ position: "sticky", top: "10px" }}>
      <Box
        sx={{
          border: "1px solid #E0E0E0",
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* Header (igual estilo) */}
        <Box
          sx={{
            background: "#0B5CAB",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ShoppingBagIcon sx={{ color: "#fff", fontSize: 22 }} />
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Resumen del pedido
            </Typography>
          </Box>
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "#0B5CAB",
              fontWeight: 700,
              fontSize: 14,
              width: 26,
              height: 26,
            }}
          >
            {totalQuantity}
          </Avatar>
        </Box>

        {/* Body: conserva tu empty state tal cual */}
        <Box sx={{ padding: "16px", minHeight: 60, bgcolor: "#FAFAFA" }}>
          {!hasItems ? (
            <Typography variant="body2" sx={{ color: "#757575", fontSize: 14 }}>
              Sin productos
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {items.map((it) => (
                <Box
                  key={it.key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  {/* Controles de cantidad + título (como CartItem con ModifyQuantity) */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <QtyStepper
                      qty={it.quantity}
                      onInc={() => onIncrementItem(it.key)}
                      onDec={() => onDecrementItem(it.key)}
                    />
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "70%",
                      }}
                    >
                      {`${it.quantity}x ${it.title}`}
                    </Typography>
                  </Box>

                  {/* Total de la línea */}
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                    {formatPrice(it.lineTotal)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer: total + acciones (sin cambios visuales) */}
        <Box sx={{ bgcolor: "#F5F5F5", padding: "12px 16px 16px 16px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{ fontWeight: 700, fontSize: 18, color: "#212121" }}
            >
              Total
            </Typography>
            <Typography
              sx={{ fontWeight: 700, fontSize: 18, color: "#212121" }}
            >
              {formatPrice(total)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DeleteOutlineIcon sx={{ fontSize: 18 }} />}
              onClick={onClearCart}
              sx={{
                textTransform: "none",
                borderColor: "#0B5CAB",
                color: "#0B5CAB",
                bgcolor: "#fff",
                px: 2,
                height: 38,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "6px",
                minWidth: "auto",
                whiteSpace: "nowrap",
                "&:hover": { borderColor: "#0B5CAB", bgcolor: "#F5F9FF" },
              }}
            >
              Borrar pedido
            </Button>
            <Button
              variant="contained"
              startIcon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={onContinue}
              disabled={totalQuantity === 0}
              sx={{
                textTransform: "none",
                bgcolor: totalQuantity === 0 ? "#E0E0E0" : "#4CAF50",
                color: totalQuantity === 0 ? "#9E9E9E" : "#fff",
                flex: 1,
                height: 38,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: "6px",
                "&:hover": {
                  bgcolor: totalQuantity === 0 ? "#E0E0E0" : "#45A049",
                },
                "&.Mui-disabled": { bgcolor: "#E0E0E0", color: "#9E9E9E" },
              }}
            >
              Continuar
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
