import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import type { LoaderFunctionArgs, TypedResponse } from "@vercel/remix";
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
  <T extends object | null>(
    loader: (args: CustomLoaderArgs) => MaybePromise<T | TypedResponse<T>>,
  ): ((args: LoaderFunctionArgs) => Promise<T | TypedResponse<T>>) =>
  async ({ context: originalContext, ...args }) => {
    const context = getLoadContext(args.request);
    return loader({ ...args, context, originalContext });
  };

export const createHydratingLoader = <T extends object | null>(
  loader: (
    args: Overwrite<
      LoaderFunctionArgs,
      {
        context: AppLoadContext;
        originalContext: LoaderFunctionArgs["context"];
      }
    >,
  ) => MaybePromise<T>,
) =>
  createLoader<
    (T extends null ? object : T) & { dehydratedState: DehydratedState }
  >(async (args) => {
    const { queryClient } = args.context;
    const data = await loader(args);
    return {
      dehydratedState: dehydrate(queryClient),
      ...data,
    } as never;
  });
