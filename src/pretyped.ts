import { useDispatch, useSelector, useStore } from "react-redux";
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { AppDispatch, AppStore, RootState } from "@/store";

export const useAppStore = useStore.withTypes<AppStore>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
