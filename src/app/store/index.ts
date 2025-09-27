import { configureStore } from "@reduxjs/toolkit";
import { reducer as menuReducer } from "./slices/menu";
import { reducer as sessionReducer } from "./slices/session";
import { reducer as globalReducer } from "./slices/global";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    menu: menuReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
