import { combineSlices } from "@reduxjs/toolkit";
import { feedbackSlice } from "./features/feedback/slice";
import { emptyApi } from "./features/api";

export const rootReducer = combineSlices(feedbackSlice, emptyApi);
