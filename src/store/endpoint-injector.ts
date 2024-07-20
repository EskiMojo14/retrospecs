import type { AppSupabaseClient } from "~/db";
import { emplace } from "~/util";
import type { AppDispatch } from ".";

export interface Unsubscribable {
  unsubscribe: () => void;
}

export interface InjectorResult<T extends {}> {
  api: T;
  realtime?: () => Unsubscribable;
}

export type EndpointInjector<T extends {}> = (
  supabase: AppSupabaseClient,
  dispatch: AppDispatch,
) => InjectorResult<T>;

export const createEndpointInjector = <T extends {}>(
  injector: EndpointInjector<T>,
) => injector;

const injectorWeakMap = new WeakMap<
  AppSupabaseClient,
  WeakMap<AppDispatch, WeakMap<EndpointInjector<any>, InjectorResult<any>>>
>();

export const applyInjector = <T extends {}>(
  injector: EndpointInjector<T>,
  supabase: AppSupabaseClient,
  dispatch: AppDispatch,
): InjectorResult<T> => {
  const result = emplace(
    emplace(
      emplace(injectorWeakMap, supabase, {
        insert: () => new WeakMap(),
      }),
      dispatch,
      {
        insert: () => new WeakMap(),
      },
    ),
    injector,
    {
      insert: () => injector(supabase, dispatch),
    },
  );
  return result as never;
};
