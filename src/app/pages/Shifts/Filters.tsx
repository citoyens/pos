import React, {
  FunctionComponent,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useTranslation } from "react-i18next";
import { Shift, ToPay } from "core/shifts/entities/Shift";
import KitchenSelector from "app/components/Kitchen/Selector";
import { commons, shiftManager } from "app/i18n/types";
import {
  KOSDateRangePicker,
  KOSDateRangePickerState,
} from "@foodology-co/alejandria";
import SearchOnTopBar from "app/components/common/SearchOnTopBar";
import { useRole } from "app/hooks/useRole";
import { compareSearchText } from "utils/general";

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

const endOfDay = (date: Date): Date =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );

const dateRangeValidator = (
  shiftDate: Date,
  startDate?: Date,
  endDate?: Date
): boolean => {
  if (!startDate || !endDate) return true;
  const day = startOfDay(shiftDate).getTime();
  return startDate.getTime() <= day && day <= endDate.getTime();
};

interface PersistentFilters {
  dateRange: KOSDateRangePickerState;
  selectedCountry: string;
  selectedCity: string;
  selectedKitchen: string;
  nameFilter: string;
  selectedToPay: ToPay | undefined;
}

interface FilterProps {
  shifts: Shift[];
  loading?: boolean;
  setFilteredShifts: (shifts: Shift[]) => void;
  onDateRangeChange?: (dateRange: KOSDateRangePickerState) => void;
  activeTab: number;
  country: string;
  onFiltersChange?: (filters: PersistentFilters, tabIndex: number) => void;
  persistentFilters?: PersistentFilters;
}

const Filters: FunctionComponent<FilterProps> = (props) => {
  const {
    shifts,
    loading = false,
    setFilteredShifts,
    onDateRangeChange,
    activeTab,
    country,
    onFiltersChange,
    persistentFilters,
  } = props;

  const { t } = useTranslation();
  const role = useRole();
  const isSuperUser = role.isSuperUser();

  const initialDates = useMemo(() => {
    const firstDay = startOfDay(new Date(new Date().setDate(1)));
    const lastDay = endOfDay(
      new Date(new Date().setMonth(new Date().getMonth() + 1, 0))
    );
    return { startDate: firstDay, endDate: lastDay };
  }, []);

  const [dateRange, setDateRange] = useState<KOSDateRangePickerState>(
    persistentFilters?.dateRange ?? initialDates
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    persistentFilters?.selectedCountry ?? " "
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    persistentFilters?.selectedCity ?? ""
  );
  const [selectedKitchen, setSelectedKitchen] = useState<string>(
    persistentFilters?.selectedKitchen ?? ""
  );
  const [nameFilter, setNameFilter] = useState<string>(
    persistentFilters?.nameFilter ?? ""
  );
  const [cleanSearch, setCleanSearch] = useState<number>(0);
  const [selectedToPay, setSelectedToPay] = useState<ToPay | undefined>(
    persistentFilters?.selectedToPay ?? undefined
  );

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const clearFilters = useCallback(() => {
    const clearedFilters: PersistentFilters = {
      dateRange: initialDates,
      selectedCountry: country,
      selectedCity: "",
      selectedKitchen: "",
      nameFilter: "",
      selectedToPay: undefined,
    };

    setDateRange(clearedFilters.dateRange);
    setSelectedCountry(clearedFilters.selectedCountry);
    setCleanSearch(new Date().getTime());
    setSelectedCity(clearedFilters.selectedCity);
    setSelectedKitchen(clearedFilters.selectedKitchen);
    setNameFilter(clearedFilters.nameFilter);
    setSelectedToPay(clearedFilters.selectedToPay);

    setFilteredShifts(shifts);

    if (onFiltersChange) {
      onFiltersChange(clearedFilters, activeTab);
    }
  }, [
    initialDates,
    country,
    shifts,
    setFilteredShifts,
    onFiltersChange,
    activeTab,
  ]);

  useEffect(() => {
    if (!isSuperUser && activeTab === 0 && country && isInitialLoad) {
      setSelectedCountry(country);
    }

    if (isInitialLoad) {
      setIsInitialLoad(false);

      if (!persistentFilters && !isSuperUser && activeTab === 0) {
        clearFilters();
      } else if (onFiltersChange) {
        const currentFilters: PersistentFilters = {
          dateRange,
          selectedCountry,
          selectedCity,
          selectedKitchen,
          nameFilter,
          selectedToPay,
        };
        onFiltersChange(currentFilters, activeTab);
      }
    } else if (onFiltersChange) {
      const currentFilters: PersistentFilters = {
        dateRange,
        selectedCountry,
        selectedCity,
        selectedKitchen,
        nameFilter,
        selectedToPay,
      };
      onFiltersChange(currentFilters, activeTab);
    }
  }, [activeTab, country, isSuperUser, isInitialLoad]);

  useEffect(() => {
    const newFiltered = shifts.filter((shift) => {
      const shiftDate = new Date(shift.startTime);
      const validDate = dateRangeValidator(
        shiftDate,
        dateRange.startDate,
        dateRange.endDate
      );

      const validCountry =
        !selectedCountry || shift.country === selectedCountry;
      const validCity = !selectedCity || shift.city === selectedCity;
      const validKitchen =
        !selectedKitchen || shift.kitchenId === selectedKitchen;

      const validName =
        !nameFilter || compareSearchText(shift.name, nameFilter);

      let validToPay = true;
      if (activeTab === 1 && selectedToPay !== undefined) {
        validToPay = shift.toPay === selectedToPay;
      }

      return (
        validDate &&
        validCountry &&
        validCity &&
        validKitchen &&
        validName &&
        validToPay
      );
    });

    setFilteredShifts(newFiltered);
  }, [
    shifts,
    dateRange,
    selectedCountry,
    selectedCity,
    selectedKitchen,
    nameFilter,
    selectedToPay,
    activeTab,
    setFilteredShifts,
  ]);

  useEffect(() => {
    if (onFiltersChange && !isInitialLoad) {
      const currentFilters: PersistentFilters = {
        dateRange,
        selectedCountry,
        selectedCity,
        selectedKitchen,
        nameFilter,
        selectedToPay,
      };
      onFiltersChange(currentFilters, activeTab);
    }
  }, [
    dateRange,
    selectedCountry,
    selectedCity,
    selectedKitchen,
    nameFilter,
    selectedToPay,
    activeTab,
    onFiltersChange,
    isInitialLoad,
  ]);

  const handleDateChange = useCallback(
    (data?: KOSDateRangePickerState) => {
      if (data && data.startDate && data.endDate) {
        const startDateUtc = new Date(data.startDate);
        startDateUtc.setUTCHours(0, 0, 0, 0);

        const endDateUtc = new Date(data.endDate);
        endDateUtc.setUTCHours(23, 59, 59, 999);

        const newRange = { startDate: startDateUtc, endDate: endDateUtc };
        setDateRange(newRange);

        if (onDateRangeChange) {
          onDateRangeChange(newRange);
        }
      }
    },
    [
      onDateRangeChange,
      onFiltersChange,
      selectedCountry,
      selectedCity,
      selectedKitchen,
      nameFilter,
      selectedToPay,
      activeTab,
      isInitialLoad,
    ]
  );

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value);
  }, []);

  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value);
  }, []);

  const handleKitchenChange = useCallback((value: string) => {
    setSelectedKitchen(value);
  }, []);

  const handleNameFilterChange = useCallback((value: string) => {
    setNameFilter(value);
  }, []);

  const handleToPayChange = useCallback((value: ToPay | undefined) => {
    setSelectedToPay(value);
  }, []);

  const disableCountrySelect = !isSuperUser && activeTab === 0;
  const authorized = activeTab === 1;

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t(commons.FILTERS)}
          </Typography>

          <SearchOnTopBar
            clean={cleanSearch}
            onSearch={handleNameFilterChange}
          />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <KOSDateRangePicker
                fullWidth
                defaultValue="now"
                onChange={handleDateChange}
              />
            </Grid>
            {disableCountrySelect && (
              <Grid item xs={2}>
                <TextField
                  label={t(commons.COUNTRY)}
                  variant="outlined"
                  fullWidth
                  value={t(`KOSLocationSelectorLocale.${country}`)}
                  disabled
                />
              </Grid>
            )}
            <Grid item xs={disableCountrySelect ? 4 : 6}>
              <KitchenSelector
                selected={{
                  country: selectedCountry,
                  city: selectedCity,
                  kitchen: selectedKitchen,
                }}
                onChange={{
                  country: (value) => handleCountryChange(value?.code ?? ""),
                  city: (value) => handleCityChange(value?.code ?? ""),
                  kitchen: (value) =>
                    handleKitchenChange(value?.kitchenId ?? ""),
                }}
                hide={{
                  country: disableCountrySelect,
                }}
                extra={{
                  disabled: loading,
                }}
              />
            </Grid>

            {authorized && (
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>{t(shiftManager.TO_PAY)}</InputLabel>
                  <Select
                    fullWidth
                    label={t(shiftManager.TO_PAY)}
                    value={selectedToPay || ""}
                    onChange={(event) =>
                      handleToPayChange(
                        (event.target.value as ToPay) ?? undefined
                      )
                    }
                    disabled={loading}
                    endAdornment={
                      selectedToPay && (
                        <IconButton
                          onClick={() => handleToPayChange(undefined)}
                          disabled={loading}
                        >
                          <ClearIcon />
                        </IconButton>
                      )
                    }
                  >
                    {Object.values(ToPay)
                      .sort((a, b) =>
                        t(`commons.${a}`).localeCompare(t(`commons.${b}`))
                      )
                      .map((key) => (
                        <MenuItem key={key} value={key}>
                          {t(`commons.${key}`)}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Filters;
