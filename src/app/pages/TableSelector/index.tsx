import { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAllTables } from "app/hooks/useAllTables";
import { TableCard } from "./TableCard";
import { Table, Status } from "core/tables/entities/Table";
import {
  setLocalStorage,
  getLocalStorageJSON,
  LocalStorageItem,
} from "utils/localStorage";

interface TableSelectorProps {
  onBack: () => void;
}

const TableSelector: FunctionComponent<TableSelectorProps> = ({ onBack }) => {
  const { getTables, tables, loading } = useAllTables();
  const [selectedFloor, setSelectedFloor] = useState<string>("all");

  useEffect(() => {
    const storedKitchen = getLocalStorageJSON(
      "selectedKitche" as LocalStorageItem
    );
    if (
      storedKitchen &&
      typeof storedKitchen === "object" &&
      "kitchenId" in storedKitchen
    ) {
      getTables((storedKitchen as any).kitchenId);
    }
  }, []);

  const floors = useMemo(() => {
    return Array.from(new Set(tables.map((t) => t.floor))).sort();
  }, [tables]);

  const filteredTables = useMemo(() => {
    if (selectedFloor === "all") return tables;
    return tables.filter((t) => t.floor === selectedFloor);
  }, [tables, selectedFloor]);

  const availableCount = useMemo(() => {
    return filteredTables.filter((t) => t.status === Status.VACANT).length;
  }, [filteredTables]);

  const handleSelectTable = (table: Table) => {
    setLocalStorage("selectedTable" as LocalStorageItem, table);
    window.location.reload();
  };

  const handleFloorChange = (event: SelectChangeEvent) => {
    setSelectedFloor(event.target.value);
  };

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">Selecciona una mesa</Typography>
          <Typography variant="body2" color="text.secondary">
            {availableCount} de {filteredTables.length} mesas disponibles
          </Typography>
        </Box>
      </Stack>

      {floors.length > 1 && (
        <FormControl size="small" sx={{ maxWidth: 200 }}>
          <InputLabel>Piso</InputLabel>
          <Select
            value={selectedFloor}
            label="Piso"
            onChange={handleFloorChange}
          >
            <MenuItem value="all">Todos los pisos</MenuItem>
            {floors.map((floor) => (
              <MenuItem key={floor} value={floor}>
                {floor}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredTables.map((table) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
              <TableCard table={table} onSelect={handleSelectTable} />
            </Grid>
          ))}
        </Grid>
      )}

      {filteredTables.length === 0 && !loading && (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay mesas disponibles
        </Typography>
      )}
    </Box>
  );
};

export default TableSelector;
