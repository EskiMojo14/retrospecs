import type { DehydratedState } from "@tanstack/react-query";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "@vercel/remix";
import type { MaybePromise } from "~/util/types";

/**
 * @param staleTime Time before data is considered stale. Default is 5 minutes.
 */
export const makeQueryClient = (staleTime = 1000 * 60 * 5) =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
      },
    },
  });

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
