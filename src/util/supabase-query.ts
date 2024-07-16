import type { BaseQueryApi } from "@reduxjs/toolkit/query";
import type {
  PostgrestError,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

export interface PostgrestMeta {
  count: number | null;
  status: number;
  statusText: string;
}

interface SupabaseQueryConfig<Intermediate, QueryArg, QueryReturn> {
  transformResponse?: (
    returnValue: Intermediate,
    meta: PostgrestMeta,
    arg: QueryArg,
  ) => QueryReturn | Promise<QueryReturn>;
}

export function supabaseQuery<
  Intermediate,
  QueryArg,
  QueryReturn = Intermediate,
>(
  queryFn: (
    arg: QueryArg,
    api: BaseQueryApi,
  ) => PromiseLike<PostgrestSingleResponse<Intermediate>>,
  {
    transformResponse = (data) => data as never,
  }: SupabaseQueryConfig<Intermediate, QueryArg, QueryReturn> = {},
): (
  arg: QueryArg,
  api: BaseQueryApi,
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
    const meta: PostgrestMeta = { count, status, statusText };
    if (error) return { error, meta };
    return {
      data: await transformResponse(data, meta, arg),
      meta,
    };
  };
}

export const compoundKey =
  <T>() =>
  <K extends keyof T>(...keys: Array<K>) =>
  (obj: Pick<T, K>) =>
    keys.map((key) => obj[key]).join("---");
