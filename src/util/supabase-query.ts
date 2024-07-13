import { BaseQueryApi } from "@reduxjs/toolkit/query";
import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";

export interface PostgrestMeta {
  count: number | null;
  status: number;
  statusText: string;
}

export function supabaseQuery<
  Intermediate,
  QueryArg,
  QueryReturn = Intermediate
>(
  queryFn: (
    arg: QueryArg,
    api: BaseQueryApi
  ) => PromiseLike<PostgrestSingleResponse<Intermediate>>,
  transformResponse: (data: Intermediate) => QueryReturn = (data) =>
    data as never
): (
  arg: QueryArg,
  api: BaseQueryApi
) => Promise<
  | {
      data: NoInfer<QueryReturn>;
      meta: PostgrestMeta;
    }
  | {
      error: PostgrestError;
      meta: PostgrestMeta;
    }
> {
  return async function query(arg, api) {
    const { data, error, count, status, statusText } = await queryFn(arg, api);
    if (error) return { error, meta: { count, status, statusText } };
    return {
      data: transformResponse(data),
      meta: { count, status, statusText },
    };
  };
}
