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
import { TableCard } from "./TableCard";
import { TableModal } from "./TableModal";
import { Table, Status } from "core/tables/entities/Table";
import {
  setLocalStorage,
  getLocalStorageJSON,
  LocalStorageItem,
} from "utils/localStorage";
import { useAllTables } from "app/components/PageHeader/hooks/useAllTables";

interface TableSelectorProps {
  onBack: () => void;
  onTableSelected?: () => void;
}

export const TableSelector: FunctionComponent<TableSelectorProps> = ({
  onBack,
  onTableSelected,
}) => {
  const { getTables, tables, loading, updateStatus } = useAllTables();
  const [selectedFloor, setSelectedFloor] = useState<string>("all");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    const activeTables = tables.filter((t) => t.status !== Status.INACTIVE);
    if (selectedFloor === "all") return activeTables;
    return activeTables.filter((t) => t.floor === selectedFloor);
  }, [tables, selectedFloor]);

  const availableCount = useMemo(() => {
    return filteredTables.filter((t) => t.status === Status.VACANT).length;
  }, [filteredTables]);

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTable(null);
  };

  const handleTakeOrder = (table: Table) => {
    setLocalStorage("selectedTable" as LocalStorageItem, table);
    handleCloseModal();
    if (onTableSelected) {
      onTableSelected();
    }
  };

  const handleViewOrder = (table: Table) => {
    console.log("Ver orden de mesa:", table);
    handleCloseModal();
  };

  const handleCloseOrder = async (table: Table) => {
    console.log("Cerrar orden de mesa:", table);
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
              <TableCard table={table} onSelect={handleTableClick} />
            </Grid>
          ))}
        </Grid>
      )}

      {filteredTables.length === 0 && !loading && (
        <Typography variant="body2" color="text.secondary" align="center">
          No hay mesas activas disponibles
        </Typography>
      )}

      <TableModal
        open={modalOpen}
        table={selectedTable}
        onClose={handleCloseModal}
        onTakeOrder={handleTakeOrder}
        onViewOrder={handleViewOrder}
        onCloseOrder={handleCloseOrder}
        onChangeStatus={updateStatus}
      />
    </Box>
  );
};

export default TableSelector;
