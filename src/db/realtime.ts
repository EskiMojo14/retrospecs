import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Database, Tables } from "./supabase";
import { AppDispatch } from "@/store";
import { supabase } from ".";

export const buildRealtimeHandler =
  <Table extends keyof Database["public"]["Tables"]>(
    table: Table,
    handlers: {
      [K in RealtimePostgresChangesPayload<{}>["eventType"]]?: (
        payload: Extract<
          RealtimePostgresChangesPayload<Tables<Table>>,
          { eventType: K }
        >,
        dispatch: AppDispatch,
      ) => void;
    },
  ) =>
  (dispatch: AppDispatch) =>
    supabase.channel(table).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      (payload) => {
        handlers[payload.eventType]?.(payload as never, dispatch);
      },
    );
