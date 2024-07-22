import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { PostgrestError } from "@supabase/supabase-js";
import { hydrate } from "~/store/hydrate";
import type { PostgrestMeta } from "~/util/supabase-query";

export const _NEVER = Symbol();
export type NEVER = typeof _NEVER;

const fakeBaseQuery: BaseQueryFn<
  void,
  NEVER,
  PostgrestError,
  {},
  PostgrestMeta
> = () => {
  throw new Error("fakeBaseQuery should never be called, use a queryFn");
};

export const makeApi = () =>
  createApi({
    baseQuery: fakeBaseQuery,
    endpoints: () => ({}),
    extractRehydrationInfo(action, { reducerPath }): any {
      if (hydrate.match(action)) {
        return action.payload[reducerPath];
      }
    },
  });

export type BaseApi = ReturnType<typeof makeApi>;
