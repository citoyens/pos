import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./state";
import { getUserMenu } from "./thunks";

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.open = !state.open;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getUserMenu.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserMenu.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
      })
      .addCase(getUserMenu.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const { toggleMenu } = menuSlice.actions;
export const { reducer } = menuSlice;

export default menuSlice;
