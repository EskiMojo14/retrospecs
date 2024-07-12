import { ThunkAction, UnknownAction, configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./reducers";

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
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
