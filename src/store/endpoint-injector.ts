import type { AppLoadContext } from "@remix-run/server-runtime";
import type { AppSupabaseClient } from "~/db";
import type { BaseApi } from "~/features/api";
import type { Unsubscribable } from "~/util";
import { emplace } from "~/util";
import type { AppStore } from ".";

export interface InjectorResult<T extends {}> {
  api: T;
  realtime?: () => Unsubscribable;
}

type InjectorContext = Pick<AppLoadContext, "supabase" | "store" | "api">;

export type EndpointInjector<T extends {}> = (
  context: InjectorContext,
) => InjectorResult<T>;

export const createEndpointInjector = <T extends {}>(
  injector: EndpointInjector<T>,
) => injector;

const injectorWeakMap = new WeakMap<
  AppSupabaseClient,
  WeakMap<
    AppStore,
    WeakMap<BaseApi, WeakMap<EndpointInjector<any>, InjectorResult<any>>>
  >
>();

export const applyInjector = <T extends {}>(
  injector: EndpointInjector<T>,
  context: InjectorContext,
): InjectorResult<T> => {
  const { supabase, store, api } = context;
  const result = emplace(
    emplace(
      emplace(
        emplace(injectorWeakMap, supabase, {
          insert: () => new WeakMap(),
        }),
        store,
        {
          insert: () => new WeakMap(),
        },
      ),
      api,
      {
        insert: () => new WeakMap(),
      },
    ),
    injector,
    {
      insert: () => injector(context),
    },
  );
  return result as never;
};
