import type { Loader } from "@remix-run/server-runtime/dist/single-fetch";
import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import type { TypedDeferredData, TypedResponse } from "@vercel/remix";
import { unstable_defineLoader as defineLoader } from "@vercel/remix";
import type { AppLoadContext } from "~/load-context.server";
import { getLoadContext } from "~/load-context.server";
import type { MaybePromise, Overwrite } from "~/util/types";

// shame these aren't exported :(
type Serializable = Exclude<
  Exclude<ReturnType<Loader>, Promise<ReturnType<Loader>>>,
  TypedDeferredData<any> | TypedResponse<any>
>;

type LoaderArgs = Parameters<Loader>[0];

type CustomLoaderArgs = Overwrite<
  LoaderArgs,
  {
    context: AppLoadContext;
    originalContext: LoaderArgs["context"];
  }
>;

export const createLoader = <T extends Serializable>(
  loader: (args: CustomLoaderArgs) => T,
) =>
  defineLoader(({ context: originalContext, ...args }) => {
    const context = getLoadContext(args.request);
    return loader({ ...args, context, originalContext });
  });

type WithDehydratedState<T> = (T extends null ? object : T) & {
  dehydratedState: DehydratedState;
};

export const createHydratingLoader = <
  T extends Record<string, Serializable> | null,
>(
  loader: (args: CustomLoaderArgs) => MaybePromise<T>,
) =>
  // @ts-expect-error interfaces don't have an index signature weee
  createLoader<WithDehydratedState<T>>(async (args) => {
    const { queryClient } = args.context;
    return {
      ...(await loader(args)),
      dehydratedState: dehydrate(queryClient),
    } as never;
  });
