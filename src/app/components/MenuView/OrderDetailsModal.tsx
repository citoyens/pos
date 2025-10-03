// src/app/components/MenuView/OrderDetailsModal.tsx

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { Order, OrderStatus } from "./types/order";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

interface OrderDetailsModalProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  formatPrice: (price: number) => string;
  onCompleteOrder?: (orderId: string) => void;
}

const statusConfig = {
  [OrderStatus.PENDING]: { label: "Pendiente", color: "warning" as const },
  [OrderStatus.IN_PROGRESS]: { label: "En progreso", color: "info" as const },
  [OrderStatus.COMPLETED]: { label: "Completada", color: "success" as const },
  [OrderStatus.CANCELLED]: { label: "Cancelada", color: "error" as const },
};

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  order,
  onClose,
  formatPrice,
  onCompleteOrder,
}) => {
  if (!order) return null;

  const config = statusConfig[order.status];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={2} alignItems="center">
          <ReceiptIcon color="primary" />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Orden #{order.id.slice(-8)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.tableName}
            </Typography>
          </Box>
          <Chip label={config.label} color={config.color} size="small" />
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tienda
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {order.storeName}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Fecha
            </Typography>
            <Typography variant="body2">
              {new Date(order.createdAt).toLocaleString("es-CO")}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Productos
            </Typography>
            <List disablePadding>
              {order.items.map((item) => (
                <ListItem key={item.key} disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">
                          {item.quantity}x {item.title}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatPrice(item.lineTotal)}
                        </Typography>
                      </Stack>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatPrice(item.unitPrice)} c/u
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6" fontWeight={700}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatPrice(order.total)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, flexDirection: "column" }}>
        <Stack direction="row" spacing={1.5} sx={{ width: "100%" }}>
          {order.status === OrderStatus.PENDING && onCompleteOrder && (
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                onCompleteOrder(order.id);
                onClose();
              }}
            >
              Completar orden
            </Button>
          )}
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cerrar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
