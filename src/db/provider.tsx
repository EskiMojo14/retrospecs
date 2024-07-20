import type { ReactNode } from "react";
import { useRef } from "react";
import { createRequiredContext } from "required-react-context";
import { createBrowserClient } from "./client";
import type { AppSupabaseClient } from ".";

const { SupabaseProvider: Provider, useSupabase } =
  createRequiredContext<AppSupabaseClient>().with({ name: "supabase" });

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<AppSupabaseClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = createBrowserClient();
  }
  return <Provider supabase={clientRef.current}>{children}</Provider>;
}

export { useSupabase };
