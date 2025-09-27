import { MenuItem } from "@foodology-co/alejandria";

import { StoreRequestError, StoreRequestStatus } from "app/store/types";

export interface MenuState {
  open: boolean;
  items: Array<MenuItem>;
  status: StoreRequestStatus;
  error: StoreRequestError;
}

export const initialState: MenuState = {
  open: false,
  items: [],
  status: "idle",
  error: null,
};
