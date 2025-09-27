import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { getSession, getUser } from "./thunks";

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getSession.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(getSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(getSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(getUser.pending, (state, action) => {
        state.user.status = "loading";
        state.user.data = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user.status = "succeeded";
        state.user.data = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export const { reducer } = sessionSlice;

export default sessionSlice;
