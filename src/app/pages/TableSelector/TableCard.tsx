import { FunctionComponent } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { Table, Status } from "core/tables/entities/Table";
import PeopleIcon from "@mui/icons-material/People";

interface TableCardProps {
  table: Table;
  onSelect: (table: Table) => void;
  disabled?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case Status.VACANT:
      return "success";
    case Status.IN_USE:
      return "error";
    case Status.RESERVED:
      return "warning";
    case Status.INACTIVE:
      return "default";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case Status.VACANT:
      return "Disponible";
    case Status.IN_USE:
      return "En uso";
    case Status.RESERVED:
      return "Reservada";
    case Status.INACTIVE:
      return "Inactiva";
    default:
      return status;
  }
};

export const TableCard: FunctionComponent<TableCardProps> = ({
  table,
  onSelect,
  disabled = false,
}) => {
  const isAvailable = table.status === Status.VACANT;

  return (
    <Card
      sx={{
        boxShadow: 1,
        transition: "0.2s",
        opacity: disabled || !isAvailable ? 0.6 : 1,
        "&:hover": {
          boxShadow: disabled || !isAvailable ? 1 : 3,
        },
      }}
    >
      <CardActionArea
        onClick={() => !disabled && isAvailable && onSelect(table)}
        disabled={disabled || !isAvailable}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {table.name}
            </Typography>
            <Chip
              label={getStatusLabel(table.status)}
              color={getStatusColor(table.status)}
              size="small"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Piso: {table.floor}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PeopleIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Capacidad: {table.capacity}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
