import { describe, vi, it, expect } from "vitest";
import { createBrowserClient } from "~/db/client";
import { makeApi } from "~/features/api";
import { applyInjector, createEndpointInjector } from "./endpoint-injector";
import { makeStore } from ".";

describe("applyInjector", () => {
  const supabase = createBrowserClient();

  const api = makeApi();
  const store = makeStore({ api });

  const context = { supabase, store, api };

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
    const { api, realtime } = applyInjector(injector, context);

    expect(api).toEqual({ myApi: true });
    expect(realtime).toBe(realtimeRef);
    expect(injector).toHaveBeenCalledWith(context);
  });
  it("should memoize the result", () => {
    const result1 = applyInjector(injector, context);
    const result2 = applyInjector(injector, context);

    expect(result1).toBe(result2);

    const store2 = makeStore();
    const result3 = applyInjector(injector, {
      ...context,
      store: store2,
    });

    expect(result1).not.toBe(result3);
  });
});
