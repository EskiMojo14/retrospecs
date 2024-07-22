import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { useRef } from "react";
import type { RootState } from "~/store";
import type { HydratingLoader } from "~/store/hydrate";
import { hydrate } from "~/store/hydrate";
import { useAppDispatch } from "~/store/pretyped";

function useHydrate(state: RootState | SerializeFrom<RootState> | undefined) {
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);
  if (!hydrated.current && state) {
    dispatch(hydrate(state));
    hydrated.current = true;
  }
}

export function useHydratingLoaderData<T extends HydratingLoader<unknown>>() {
  const { state, data } = useLoaderData<T>();
  useHydrate(state);
  return data as SerializeFrom<T extends HydratingLoader<infer U> ? U : never>;
}

export function useHydratingRouteLoaderData<T extends HydratingLoader<unknown>>(
  route: string,
) {
  const routeLoaderData = useRouteLoaderData<T>(route);
  const { state, data } = routeLoaderData ?? {};
  useHydrate(state);
  return data as
    | SerializeFrom<T extends HydratingLoader<infer U> ? U : never>
    | undefined;
}
