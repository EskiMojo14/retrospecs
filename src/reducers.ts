import { combineSlices } from "@reduxjs/toolkit";
import { feedbackSlice } from "./features/slice";

export const rootReducer = combineSlices(feedbackSlice);
