import { ThunkAction, UnknownAction, configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "@/reducers";
import { emptyApi } from "@/features/api";

export type PreloadedState = Parameters<typeof rootReducer>[0];

export const makeStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (gDM) => gDM().concat(emptyApi.middleware),
  });

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
