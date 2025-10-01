import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Alert,
  BrandsState,
  CitiesState,
  CompanyState,
  CountriesState,
  defaultData,
  defaultDataSingle,
  initialState,
  KitchensState,
} from "./state";

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showAlert: (state, alert: PayloadAction<Alert>) => {
      state.alert = { ...alert.payload, show: true };
    },
    queueAlert: (state, alert: PayloadAction<Alert>) => {
      state.alerts.push({ ...alert.payload, show: true });
    },
    dequeueAlert: (state) => {
      state.alerts.shift();
    },
    showSearchOnTopBar: (state) => {
      state.textSearchOnTopBar = "";
      state.canSearchOnTopBar = true;
    },
    hideSearchOnTopBar: (state) => {
      state.textSearchOnTopBar = "";
      state.canSearchOnTopBar = false;
    },
    setSearchOnTopBar: (state, action: PayloadAction<string>) => {
      state.textSearchOnTopBar = action.payload;
    },
    clearSearchOnTopBar: (state) => {
      state.textSearchOnTopBar = "";
    },
    hideAlert: (state) => {
      state.alert = { show: false };
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    clearTitle: (state) => {
      state.title = null;
    },
    setKitchens: (state, action: PayloadAction<KitchensState>) => {
      state.kitchens = action.payload;
    },
    clearKitchens: (state) => {
      state.kitchens = defaultData as KitchensState;
    },
    setCities: (state, action: PayloadAction<CitiesState>) => {
      state.cities = action.payload;
    },
    clearCities: (state) => {
      state.cities = defaultData as CitiesState;
    },
    setCountries: (state, action: PayloadAction<CountriesState>) => {
      state.countries = action.payload;
    },
    clearCountries: (state) => {
      state.countries = defaultData as CountriesState;
    },
    setCompany: (state, action: PayloadAction<CompanyState>) => {
      state.company = action.payload;
    },
    clearCompany: (state) => {
      state.company = defaultDataSingle as CompanyState;
    },
    setBrands: (state, action: PayloadAction<BrandsState>) => {
      state.brands = action.payload;
    },
    clearBrands: (state) => {
      state.brands = defaultData as BrandsState;
    },
  },
});

export const {
  setCompany,
  clearCompany,
  queueAlert,
  dequeueAlert,
  showAlert,
  hideAlert,
  setTitle,
  clearTitle,
  showSearchOnTopBar,
  hideSearchOnTopBar,
  setSearchOnTopBar,
  clearSearchOnTopBar,
  setKitchens,
  clearKitchens,
  setCities,
  clearCities,
  setCountries,
  clearCountries,
  setBrands,
  clearBrands,
} = globalSlice.actions;
export const { reducer } = globalSlice;

export default globalSlice;
