import {
  KOSDateRangePickerState,
  KOSPageBox,
  KOSSelectedResult,
  KOSTabs,
} from "@foodology-co/alejandria";
import { commons, shiftManager } from "app/i18n/types";
import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ShiftModal } from "utils/modal";
import Filters from "./Filters";
import PageHeader from "app/components/PageHeader";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { DateRange, Shift, ToPay } from "core/shifts/entities/Shift";
import { byDateRange, getUnprocessed } from "core/shifts/repository/shiftRepo";
import ShiftTable from "app/components/Shift/Table";
import ShiftManagerDialog from "app/components/Shift/Manager";
import HistoricalShiftTable from "app/components/Shift/Historical";
import { ExportCSV } from "app/utils/exportCSV";
import { useAppSelector } from "app/hooks/useAppSelector";
import { useRole } from "app/hooks/useRole";
import CreateExtraHourModal from "app/components/Shift/Manager/createExtraHourModal";

interface PersistentFilters {
  dateRange: KOSDateRangePickerState;
  selectedCountry: string;
  selectedCity: string;
  selectedKitchen: string;
  nameFilter: string;
  selectedToPay: ToPay | undefined;
}

interface Props {}

const ShiftPage: FunctionComponent<Props> = () => {
  const { t } = useTranslation();

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [selectedItems, setSelectedItems] = useState<KOSSelectedResult[]>([]);

  const [historical, setHistorical] = useState<Shift[]>([]);
  const [filteredHistorical, setFilteredHistorical] = useState<Shift[]>([]);
  const [selectedItemsHistorical, setSelectedItemsHistorical] = useState<
    KOSSelectedResult[]
  >([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<ShiftModal>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [createExtraHourOpen, setCreateExtraHourOpen] =
    useState<boolean>(false);

  const [currentDateRange, setCurrentDateRange] =
    useState<KOSDateRangePickerState | null>(null);

  const [persistentFilters, setPersistentFilters] = useState<
    PersistentFilters | undefined
  >();

  const country =
    useAppSelector((state) => state.session.user.data?.profile.country) ??
    "COL";
  const role = useRole();
  const isSuperUser = role.isSuperUser();

  const { getCSV } = ExportCSV({
    selectedItemsHistorical: selectedItemsHistorical.map((item) => ({
      id: item.id,
    })),
    historical,
  });

  const getData = useCallback(
    (filters?: PersistentFilters) => {
      setSelectedItems([]);
      setLoading(true);
      getUnprocessed(country, isSuperUser)
        .then((response) => {
          setShifts(response);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [country, isSuperUser]
  );
  const getRange = useCallback(
    (range: KOSDateRangePickerState, filters?: PersistentFilters) => {
      const newRange: DateRange = {
        startTime: range.startDate,
        endTime: range.endDate,
      };
      setSelectedItemsHistorical([]);
      setLoading(true);
      byDateRange(newRange)
        .then((response) => {
          setHistorical(response);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );
  const handleFiltersChange = useCallback(
    (filters: PersistentFilters, activeTab: number) => {
      setPersistentFilters(filters);
      setCurrentDateRange(filters.dateRange);

      if (activeTab === 0) {
        getData(filters);
      } else if (activeTab === 1) {
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          getRange(filters.dateRange, filters);
        }
      }
    },
    [getData, getRange]
  );

  const onCloseModal = () => setModal(undefined);
  const handleOpenCreateExtraHour = () => setCreateExtraHourOpen(true);
  const handleCloseCreateExtraHour = () => setCreateExtraHourOpen(false);

  const handleDateRangeChange = (newDateRange: KOSDateRangePickerState) => {
    setCurrentDateRange(newDateRange);
  };

  const handleTabChange = useCallback((newTabIndex: number) => {
    setTabIndex(newTabIndex);
  }, []);

  const handleManualRefresh = useCallback(() => {
    if (tabIndex === 0) {
      getData(persistentFilters);
    } else if (tabIndex === 1 && currentDateRange) {
      getRange(currentDateRange, persistentFilters);
    }
  }, [tabIndex, persistentFilters, currentDateRange, getData, getRange]);

  const handleModalSuccess = useCallback(() => {
    if (tabIndex === 0) {
      getData(persistentFilters);
    }
  }, [tabIndex, getData, persistentFilters]);

  useEffect(() => {
    if (tabIndex === 0) {
      getData();
    }
  }, []);

  return (
    <KOSPageBox>
      <PageHeader
        title={shiftManager.TITLE}
        rightArea={[
          {
            children: t(commons.EXPORT),
            variant: "contained",
            onClick: getCSV,
            disabled: !selectedItemsHistorical.length,
            show: tabIndex === 1,
            startIcon: <FileDownloadOutlinedIcon />,
          },
          {
            children: t(shiftManager.CREATE_EXTRA_HOUR),
            variant: "contained",
            color: "primary",
            startIcon: <AddCircleOutlineIcon />,
            show: tabIndex === 0,
            onClick: handleOpenCreateExtraHour,
          },
          {
            children: t(commons.UPDATE),
            variant: "outlined",
            startIcon: <RestartAltOutlinedIcon />,
            onClick: handleManualRefresh,
          },
        ]}
      />
      <Filters
        shifts={tabIndex === 0 ? shifts : historical}
        setFilteredShifts={
          tabIndex === 0 ? setFilteredShifts : setFilteredHistorical
        }
        loading={loading}
        activeTab={tabIndex}
        onDateRangeChange={handleDateRangeChange}
        country={country}
        onFiltersChange={handleFiltersChange}
        persistentFilters={persistentFilters}
      />

      <KOSTabs
        tabs={[
          {
            children: { text: t(shiftManager.WITHOUT_AUTHORIZATION) },
          },
          {
            children: { text: t(shiftManager.AUTHORIZED) },
          },
        ]}
        loading={loading}
        onChange={handleTabChange}
      />

      {tabIndex === 0 && (
        <ShiftTable
          filteredShifts={filteredShifts}
          loading={loading}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setModal={setModal}
          refreshData={handleModalSuccess}
        />
      )}

      {tabIndex === 1 && (
        <HistoricalShiftTable
          filteredShifts={filteredHistorical}
          loading={loading}
          selectedItems={selectedItemsHistorical}
          setSelectedItems={setSelectedItemsHistorical}
          setModal={setModal}
        />
      )}

      {modal?.open && (
        <ShiftManagerDialog
          {...modal}
          onClose={onCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      <CreateExtraHourModal
        open={createExtraHourOpen}
        onClose={handleCloseCreateExtraHour}
        onSuccess={handleModalSuccess}
      />
    </KOSPageBox>
  );
};

export default ShiftPage;
