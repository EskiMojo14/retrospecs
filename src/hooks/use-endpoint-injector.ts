import { useEffect, useRef } from "react";
import { useSupabase } from "~/db/provider";
import type {
  EndpointInjector,
  InjectorResult,
} from "~/store/endpoint-injector";
import { applyInjector } from "~/store/endpoint-injector";
import { useAppStore } from "~/store/pretyped";
import { useApi } from "~/store/provider";
import type { Unsubscribable } from "~/util";

const realtimeMap = new Map<() => Unsubscribable, Unsubscribable>();

export function useEndpointInjector<T extends {}>(
  injector: EndpointInjector<T>,
) {
  const supabase = useSupabase();
  const baseApi = useApi();
  const store = useAppStore();
  const resultRef = useRef<InjectorResult<T> | null>(null);
  if (!resultRef.current) {
    resultRef.current = applyInjector(injector, {
      supabase,
      api: baseApi,
      store,
    });
  }
  const { api, realtime } = resultRef.current;
  useEffect(() => {
    if (!realtime || realtimeMap.has(realtime)) return;
    let channel;
    realtimeMap.set(realtime, (channel = realtime()));
    return () => {
      channel.unsubscribe();
      realtimeMap.delete(realtime);
    };
  }, [realtime]);
  return api;
}
