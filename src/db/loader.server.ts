import { LoaderFunctionArgs } from "@remix-run/server-runtime";
import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import type { AppLoadContext } from "~/load-context.server";
import { getLoadContext } from "~/load-context.server";
import type { MaybePromise, Overwrite } from "~/util/types";

type CustomLoaderArgs = Overwrite<
  LoaderFunctionArgs,
  {
    context: AppLoadContext;
    originalContext: LoaderFunctionArgs["context"];
  }
>;

export const createLoader =
  <T>(loader: (args: CustomLoaderArgs) => T) =>
  ({ context: originalContext, ...args }: LoaderFunctionArgs) => {
    const context = getLoadContext(args.request);
    return loader({ ...args, context, originalContext });
  };

type WithDehydratedState<T> = (T extends null ? object : Awaited<T>) & {
  dehydratedState: DehydratedState;
};

export const createHydratingLoader = <T extends MaybePromise<object | null>>(
  loader: (args: CustomLoaderArgs) => MaybePromise<T>,
) =>
  createLoader(async (args) => {
    const { queryClient } = args.context;
    return {
      ...(await loader(args)),
      dehydratedState: dehydrate(queryClient),
    } as WithDehydratedState<T>;
  });
