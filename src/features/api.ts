import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { PostgrestError } from "@supabase/supabase-js";
import { PostgrestMeta } from "../util/supabase-query";

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

export const emptyApi = createApi({
  baseQuery: fakeBaseQuery,
  endpoints: () => ({}),
});
