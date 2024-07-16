import { combineSlices } from "@reduxjs/toolkit";
import { emptyApi } from "@/features/api";
import { feedbackSlice } from "@/features/feedback/slice-old";

export const rootReducer = combineSlices(emptyApi, feedbackSlice);
