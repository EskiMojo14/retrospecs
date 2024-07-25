import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSupabase } from "~/db/provider";
import type { Unsubscribable } from "~/util";
import type { AppContext } from "~/util/supabase-query";

export function useRealtime(handler: (context: AppContext) => Unsubscribable) {
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = handler({ supabase, queryClient });
    return () => {
      channel.unsubscribe();
    };
  }, [supabase, queryClient, handler]);
}
