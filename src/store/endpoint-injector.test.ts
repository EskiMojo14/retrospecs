import { describe, vi, it, expect } from "vitest";
import { createBrowserClient } from "~/db/client";
import { applyInjector, createEndpointInjector } from "./endpoint-injector";
import { makeStore } from ".";

describe("applyEndpointInjector", () => {
  const supabase = createBrowserClient();

  const store = makeStore();

  const realtimeRef = () => ({
    unsubscribe() {},
  });

  const injector = vi.fn(
    createEndpointInjector(() => ({
      api: {
        myApi: true,
      },
      realtime: realtimeRef,
    })),
  );
  it("should inject the endpoint", () => {
    const { api, realtime } = applyInjector(injector, supabase, store.dispatch);

    expect(api).toEqual({ myApi: true });
    expect(realtime).toBe(realtimeRef);
    expect(injector).toHaveBeenCalledWith(supabase, store.dispatch);
  });
  it("should memoize the result", () => {
    const result1 = applyInjector(injector, supabase, store.dispatch);
    const result2 = applyInjector(injector, supabase, store.dispatch);

    expect(result1).toBe(result2);

    const store2 = makeStore();
    const result3 = applyInjector(injector, supabase, store2.dispatch);

    expect(result1).not.toBe(result3);
  });
});
