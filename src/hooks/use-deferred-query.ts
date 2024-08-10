import type {
  DataTag,
  EnsureQueryDataOptions,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { PostgrestErrorWithMeta } from "~/util/supabase-query";
import { useShallowStableValue } from "./use-shallow-stable";

export interface DeferredQuery<T> {
  queryKey: DataTag<QueryKey, T>;
  promise: Promise<T>;
}

export const createDeferredQueries = <T extends Array<any>>(
  queryClient: QueryClient,
  ...deferredQueries: {
    [K in keyof T]: EnsureQueryDataOptions<T[K], PostgrestErrorWithMeta>;
  }
): {
  [K in keyof T]: DeferredQuery<T[K]>;
} =>
  deferredQueries.map((options) => ({
    queryKey: options.queryKey,
    promise: queryClient.ensureQueryData(options),
  })) as never;

export function useDeferredQueries<T extends Array<any>>(deferredQueries: {
  [K in keyof T]: DeferredQuery<T[K]>;
}) {
  const queryClient = useQueryClient();
  const stableQueries = useShallowStableValue(deferredQueries);
  useEffect(() => {
    const ac = new AbortController();
    for (const { queryKey, promise } of stableQueries) {
      promise
        .then((data) => {
          if (ac.signal.aborted) return;
          console.log("Setting query data", queryKey, data);
          queryClient.setQueryData(queryKey, data);
        })
        .catch(() => {});
    }
    return () => {
      ac.abort();
    };
  }, [stableQueries, queryClient]);
}
