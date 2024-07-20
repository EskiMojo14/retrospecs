import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { emptyApi } from "~/features/api";
import { rootReducer } from "~/reducers";

export type PreloadedState = Parameters<typeof rootReducer>[0];

export const makeStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (gDM) => gDM().concat(emptyApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
