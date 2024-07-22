import type { ThunkAction, UnknownAction, WithSlice } from "@reduxjs/toolkit";
import { combineSlices, configureStore } from "@reduxjs/toolkit";
import type { BaseApi } from "~/features/api";
import { makeApi } from "~/features/api";

export type PreloadedState = Partial<WithSlice<BaseApi>>;

export const makeStore = ({
  preloadedState,
  api = makeApi(),
}: {
  preloadedState?: PreloadedState;
  api?: BaseApi;
} = {}) =>
  configureStore({
    reducer: combineSlices(api),
    preloadedState,
    middleware: (gDM) => gDM().concat(api.middleware),
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
