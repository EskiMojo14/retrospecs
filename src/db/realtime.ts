import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import { toLowerCaseTyped } from "~/util";
import type { Database, Tables } from "./supabase";
import type { AppSupabaseClient } from ".";

export const buildRealtimeHandler =
  <Table extends keyof Database["public"]["Tables"]>(
    supabase: AppSupabaseClient,
    table: Table,
    handlers: {
      [K in RealtimePostgresChangesPayload<{}>["eventType"] as Lowercase<K>]?: (
        payload: Extract<
          RealtimePostgresChangesPayload<Tables<Table>>,
          { eventType: K }
        >,
      ) => void;
    },
  ) =>
  (): RealtimeChannel =>
    supabase.channel(table).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: table,
      },
      (payload) => {
        handlers[toLowerCaseTyped(payload.eventType)]?.(payload as never);
      },
    );
