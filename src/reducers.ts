import { combineSlices } from "@reduxjs/toolkit";
import { feedbackSlice } from "@/features/feedback/slice-old";
import { emptyApi } from "@/features/api";

export const rootReducer = combineSlices(feedbackSlice, emptyApi);
