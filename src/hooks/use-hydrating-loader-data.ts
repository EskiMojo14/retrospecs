import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import { useRef } from "react";
import type { HydratingLoader } from "~/store/hydrate";
import { hydrate } from "~/store/hydrate";
import { useAppDispatch } from "~/store/pretyped";

export function useHydratingLoaderData<T extends HydratingLoader<unknown>>() {
  const { state, data } = useLoaderData<T>();
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);
  if (!hydrated.current) {
    dispatch(hydrate(state));
    hydrated.current = true;
  }
  return data as SerializeFrom<T extends HydratingLoader<infer U> ? U : never>;
}

export function useHydratingRouteLoaderData<T extends HydratingLoader<unknown>>(
  route: string,
) {
  const routeLoaderData = useRouteLoaderData<T>(route);
  const dispatch = useAppDispatch();
  const hydrated = useRef(false);
  if (!routeLoaderData) return undefined;
  const { state, data } = routeLoaderData;
  if (!hydrated.current) {
    dispatch(hydrate(state));
    hydrated.current = true;
  }
  return data as SerializeFrom<T extends HydratingLoader<infer U> ? U : never>;
}
