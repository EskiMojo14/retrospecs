import { combineSlices } from "@reduxjs/toolkit";
import { feedbackSlice } from "./features/feedback/slice";

export const rootReducer = combineSlices(feedbackSlice);
