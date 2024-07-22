import { createAction } from "@reduxjs/toolkit";
import type {
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/server-runtime";
import type { MaybePromise } from "~/util/types";
import type { RootState } from ".";

export interface HydrationData<T> {
  state: RootState;
  data: T;
}

export type HydratingLoader<T> = (
  args: LoaderFunctionArgs,
) => Promise<HydrationData<T>>;

export const createHydratingLoader =
  <T extends {} | null>(
    loader: (args: LoaderFunctionArgs) => MaybePromise<T>,
  ): HydratingLoader<T> =>
  async (args) => {
    const { store } = args.context;
    const data = await loader(args);
    return { state: store.getState(), data };
  };

export const hydrate = createAction<RootState | SerializeFrom<RootState>>(
  "@loader/hydrate",
);
