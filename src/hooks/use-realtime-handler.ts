import { useEffect } from "react";
import { useSupabase } from "~/db/provider";
import type { RealtimeHandler } from "~/db/realtime";
import { useAppDispatch } from "~/pretyped";

export function useRealtimeHandler(handler: RealtimeHandler) {
  const dispatch = useAppDispatch();
  const supabase = useSupabase();
  useEffect(() => {
    const channel = handler(dispatch, supabase);
    return () => void channel.unsubscribe();
  }, [dispatch, handler, supabase]);
}
