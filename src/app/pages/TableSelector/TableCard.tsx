import React from "react";
import { Card, CardContent, Typography, Stack, Box, Chip } from "@mui/material";
import {
  TableRestaurant as TableIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { Table, Status } from "core/tables/entities/Table";

interface TableCardProps {
  table: Table;
  onSelect: (table: Table) => void;
}

const statusConfig = {
  [Status.VACANT]: {
    label: "Disponible",
    color: "success" as const,
  },
  [Status.IN_USE]: {
    label: "En uso",
    color: "error" as const,
  },
  [Status.RESERVED]: {
    label: "Reservada",
    color: "warning" as const,
  },
  [Status.INACTIVE]: {
    label: "Inactiva",
    color: "default" as const,
  },
};

export const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
  const config = statusConfig[table.status as Status];

  return (
    <Card
      sx={{
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        height: "100%",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
      onClick={() => onSelect(table)}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TableIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {table.name}
              </Typography>
            </Stack>
            <Chip label={config.label} color={config.color} size="small" />
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {table.capacity}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Piso {table.floor}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
