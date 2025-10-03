// src/app/components/TableSelector/TableModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Box,
  CircularProgress,
  Divider,
  Paper,
} from "@mui/material";
import {
  TableRestaurant as TableIcon,
  People as PeopleIcon,
  Stairs as StairsIcon,
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  BookOnline as BookOnlineIcon,
  LockOpen as LockOpenIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  Restaurant as RestaurantIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { Table, Status } from "core/tables/entities/Table";
import { orderManager } from "app/components/MenuView/utils/orderManager";
import { Order } from "app/components/MenuView/types/order";
import { OrderDetailsModal } from "app/components/MenuView/OrderDetailsModal";

interface TableModalProps {
  open: boolean;
  table: Table | null;
  onClose: () => void;
  onTakeOrder: (table: Table) => void;
  onViewOrder: (table: Table) => void;
  onCloseOrder: (table: Table) => void;
  onChangeStatus: (tableId: string, newStatus: Status) => Promise<void>;
}

type ActionType =
  | "take-order"
  | "view-order"
  | "close-order"
  | "reserve"
  | "free";

const statusConfig: Record<
  Status,
  {
    label: string;
    color: "success" | "error" | "warning" | "default";
    actions: ActionType[];
    icon: React.ReactNode;
  }
> = {
  [Status.VACANT]: {
    label: "Disponible",
    color: "success",
    actions: ["take-order", "reserve"],
    icon: <CheckCircleIcon />,
  },
  [Status.IN_USE]: {
    label: "En uso",
    color: "error",
    actions: ["view-order", "close-order"],
    icon: <RestaurantIcon />,
  },
  [Status.RESERVED]: {
    label: "Reservada",
    color: "warning",
    actions: ["take-order", "free"],
    icon: <BookOnlineIcon />,
  },
  [Status.INACTIVE]: {
    label: "Inactiva",
    color: "default",
    actions: [],
    icon: <CloseIcon />,
  },
};

export const TableModal: React.FC<TableModalProps> = ({
  open,
  table,
  onClose,
  onTakeOrder,
  onViewOrder,
  onCloseOrder,
  onChangeStatus,
}) => {
  const [loading, setLoading] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  if (!table) return null;

  const config = statusConfig[table.status as Status];

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);

  const handleTakeOrder = async () => {
    setLoading(true);
    try {
      await onChangeStatus(table.id, Status.IN_USE);
      onTakeOrder(table);
    } catch (error) {
      console.error("Error al tomar la orden:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = () => {
    const order = orderManager.getOrderByTableId(table.id);
    if (order) {
      setCurrentOrder(order);
      setOrderDetailsOpen(true);
    } else {
      console.warn("No se encontró orden activa para esta mesa");
    }
  };

  const handleCloseOrder = async () => {
    setLoading(true);
    try {
      const order = orderManager.getOrderByTableId(table.id);
      if (order) {
        orderManager.completeOrder(order.id);
      }
      await onCloseOrder(table);
      await onChangeStatus(table.id, Status.VACANT);
      onClose();
    } catch (error) {
      console.error("Error al cerrar la orden:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    orderManager.completeOrder(orderId);
    await onChangeStatus(table.id, Status.VACANT);
    setOrderDetailsOpen(false);
    setCurrentOrder(null);
    onClose();
  };

  const handleReserve = async () => {
    setLoading(true);
    try {
      await onChangeStatus(table.id, Status.RESERVED);
      onClose();
    } catch (error) {
      console.error("Error al reservar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFree = async () => {
    setLoading(true);
    try {
      await onChangeStatus(table.id, Status.VACANT);
      onClose();
    } catch (error) {
      console.error("Error al liberar:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener información de la orden actual si existe
  const activeOrder =
    table.status === Status.IN_USE
      ? orderManager.getOrderByTableId(table.id)
      : null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle sx={{ pb: 2, pt: 3 }}>
          <Stack spacing={2}>
            {/* Encabezado principal */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: "primary.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TableIcon fontSize="large" color="primary" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={600}>
                  {table.name}
                </Typography>
              </Box>
              <Chip
                label={config.label}
                color={config.color}
                icon={config.icon as React.ReactElement}
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Divider />

            {/* Información de la mesa */}
            <Stack direction="row" spacing={3}>
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 1.5,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <PeopleIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Capacidad
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {table.capacity} personas
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  p: 1.5,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <StairsIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Ubicación
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Piso {table.floor}
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Stack>
        </DialogTitle>

        {/* Contenido adicional según el estado */}
        {(table.status === Status.IN_USE ||
          table.status === Status.RESERVED) && (
          <DialogContent sx={{ pt: 0, pb: 3 }}>
            {table.status === Status.IN_USE && activeOrder && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "error.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "error.200",
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <InfoIcon color="action" fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Mesa con orden activa
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Items en la orden
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {activeOrder.items.length} productos
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Total actual
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatPrice(activeOrder.total)}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            )}

            {table.status === Status.RESERVED && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "warning.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "warning.200",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <InfoIcon color="warning" fontSize="small" />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="warning.main"
                  >
                    Mesa reservada para cliente
                  </Typography>
                </Stack>
              </Paper>
            )}
          </DialogContent>
        )}

        {/* Acciones */}
        <DialogActions sx={{ p: 3, pt: 2, flexDirection: "column", gap: 2 }}>
          <Stack spacing={1.5} sx={{ width: "100%" }}>
            {config.actions.includes("take-order") && (
              <Button
                fullWidth
                variant="contained"
                onClick={handleTakeOrder}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <ReceiptIcon />
                }
              >
                {loading ? "Procesando..." : "Tomar orden"}
              </Button>
            )}

            {config.actions.includes("view-order") && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleViewOrder}
                disabled={loading}
                startIcon={<VisibilityIcon />}
              >
                Ver orden en curso
              </Button>
            )}

            {config.actions.includes("close-order") && (
              <Button
                fullWidth
                variant="contained"
                color="success"
                onClick={handleCloseOrder}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <MoneyIcon />
                }
              >
                {loading ? "Procesando..." : "Cobrar y cerrar orden"}
              </Button>
            )}

            {config.actions.includes("reserve") && (
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                onClick={handleReserve}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <BookOnlineIcon />
                }
              >
                {loading ? "Procesando..." : "Reservar mesa"}
              </Button>
            )}

            {config.actions.includes("free") && (
              <Button
                fullWidth
                variant="outlined"
                color="success"
                onClick={handleFree}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <LockOpenIcon />
                }
              >
                {loading ? "Procesando..." : "Liberar mesa"}
              </Button>
            )}
          </Stack>

          <Button
            variant="text"
            onClick={onClose}
            disabled={loading}
            startIcon={<CloseIcon />}
            sx={{ minWidth: 200 }}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <OrderDetailsModal
        open={orderDetailsOpen}
        order={currentOrder}
        onClose={() => {
          setOrderDetailsOpen(false);
          setCurrentOrder(null);
        }}
        formatPrice={formatPrice}
        onCompleteOrder={handleCompleteOrder}
      />
    </>
  );
};
