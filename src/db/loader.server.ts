import type { Loader } from "@remix-run/server-runtime/dist/single-fetch";
import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import type { AppLoadContext } from "~/load-context.server";
import { getLoadContext } from "~/load-context.server";
import type { MaybePromise, Overwrite } from "~/util/types";

type LoaderArgs = Parameters<Loader>[0];

type CustomLoaderArgs = Overwrite<
  LoaderArgs,
  {
    context: AppLoadContext;
    originalContext: LoaderArgs["context"];
  }
>;

export const createLoader =
  <T extends object | null>(
    loader: (args: CustomLoaderArgs) => MaybePromise<T>,
  ) =>
  ({ context: originalContext, ...args }: LoaderArgs) => {
    const context = getLoadContext(args.request);
    return loader({ ...args, context, originalContext });
  };

type WithDehydratedState<T> = (T extends null ? object : Awaited<T>) & {
  dehydratedState: DehydratedState;
};

export const createHydratingLoader = <T extends object | null>(
  loader: (args: CustomLoaderArgs) => MaybePromise<T>,
) =>
  createLoader<WithDehydratedState<T>>(async (args) => {
    const { queryClient } = args.context;
    return {
      ...(await loader(args)),
      dehydratedState: dehydrate(queryClient),
    } as WithDehydratedState<T>;
  });
