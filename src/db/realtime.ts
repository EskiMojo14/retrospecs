import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { AppDispatch } from "~/store";
import { toLowerCaseTyped } from "~/util";
import type { Database, Tables } from "./supabase";
import { supabase } from ".";

export const buildRealtimeHandler =
  <Table extends keyof Database["public"]["Tables"]>(
    table: Table,
    handlers: {
      [K in RealtimePostgresChangesPayload<{}>["eventType"] as Lowercase<K>]?: (
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
        handlers[toLowerCaseTyped(payload.eventType)]?.(
          payload as never,
          dispatch,
        );
      },
    );
