import { useEffect, useRef } from "react";
import { useSupabase } from "~/db/provider";
import {
  applyInjector,
  type EndpointInjector,
  type InjectorResult,
  type Unsubscribable,
} from "~/store/endpoint-injector";
import { useAppDispatch } from "~/store/pretyped";

const realtimeMap = new Map<() => Unsubscribable, Unsubscribable>();

export function useEndpointInjector<T extends {}>(
  injector: EndpointInjector<T>,
) {
  const supabase = useSupabase();
  const dispatch = useAppDispatch();
  const resultRef = useRef<InjectorResult<T> | null>(null);
  if (!resultRef.current) {
    resultRef.current = applyInjector(injector, supabase, dispatch);
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
