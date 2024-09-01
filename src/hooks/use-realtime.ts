import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSupabase } from "~/db/provider";
import type { Unsubscribable } from "~/util";
import { mapEmplace } from "~/util/ponyfills";
import type { AppContext } from "~/util/supabase-query";

const handlerCache = new WeakMap<
  (context: AppContext) => Unsubscribable,
  { channel: Unsubscribable; count: number }
>();

export function useRealtime(handler: (context: AppContext) => Unsubscribable) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  useEffect(() => {
    const entry = mapEmplace(handlerCache, handler, {
      insert: () => ({
        channel: handler({ supabase, queryClient }),
        count: 1,
      }),
      update: (entry) => {
        entry.count++;
        return entry;
      },
    });
    return () => {
      entry.count--;
      if (entry.count === 0) {
        entry.channel.unsubscribe();
        handlerCache.delete(handler);
      }
    };
  }, [supabase, queryClient, handler]);
}
