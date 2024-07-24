import type { AppLoadContext } from "@remix-run/server-runtime";
import type { Unsubscribable } from "~/util";

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
