import { AlertColor, SnackbarOrigin } from "@mui/material";
import { StoreRequestError, StoreRequestStatus } from "app/store/types";
import { City } from "core/city/entities/City";
import { Company } from "core/company/entities/Company";
import { Country } from "core/country/entities/Country";
import { KitchenSlice } from "core/kitchens/entities/Kitchen";

export interface Alert {
  show?: boolean;
  title?: string | null;
  message?: string | null;
  duration?: number | null;
  severity?: AlertColor;
  position?: SnackbarOrigin;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  audioOn?: boolean | null;
}

export interface KitchensState {
  data: KitchenSlice[];
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface CitiesState {
  data: City[];
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface PlatformsState {
  data: string[];
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface CountriesState {
  data: Country[];
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface CompanyState {
  data?: Company;
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export interface GlobalState {
  alert: Alert;
  alerts: Alert[];
  title: string | null;
  kitchens: KitchensState;
  platforms: PlatformsState;
  company: CompanyState;
  countries: CountriesState;
  cities: CitiesState;
  canSearchOnTopBar: boolean;
  textSearchOnTopBar: string;
}

export const defaultDataSingle = {
  status: "idle",
  error: null,
};

export const defaultData = {
  data: [],
  ...defaultDataSingle,
};

export const initialState: GlobalState = {
  alert: { show: false },
  alerts: [],
  kitchens: defaultData as KitchensState,
  platforms: defaultData as PlatformsState,
  cities: defaultData as CitiesState,
  countries: defaultData as CountriesState,
  company: defaultDataSingle as CompanyState,
  title: null,
  canSearchOnTopBar: false,
  textSearchOnTopBar: "",
};
