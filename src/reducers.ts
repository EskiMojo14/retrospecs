import { combineSlices } from "@reduxjs/toolkit";
import { feedbackSlice } from "@/features/feedback/slice-old";
import { emptyApi } from "@/features/api";
import { contextSlice } from "./features/context/slice";

export const rootReducer = combineSlices(emptyApi, feedbackSlice, contextSlice);
