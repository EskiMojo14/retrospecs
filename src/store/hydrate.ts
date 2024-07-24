import { createAction } from "@reduxjs/toolkit";
import type {
  LoaderFunctionArgs,
  SerializeFrom,
} from "@remix-run/server-runtime";
import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import type { MaybePromise } from "~/util/types";
import type { RootState } from ".";

export type HydratingLoader<T> = (
  args: LoaderFunctionArgs,
) => Promise<
  (T extends null ? object : T) & { dehydratedState: DehydratedState }
>;

export const createHydratingLoader =
  <T extends object | null>(
    loader: (args: LoaderFunctionArgs) => MaybePromise<T>,
  ): HydratingLoader<T> =>
  async (args) => {
    const { queryClient } = args.context;
    const data = await loader(args);
    return {
      dehydratedState: dehydrate(queryClient),
      ...data,
    } as never;
  };

export const hydrate = createAction<RootState | SerializeFrom<RootState>>(
  "@loader/hydrate",
);
