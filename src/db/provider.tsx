import type { ReactNode } from "react";
import { useRef } from "react";
import { createRequiredContext } from "required-react-context";
import { createBrowserClient } from "./client";
import type { AppSupabaseClient } from ".";

export const { SupabaseProvider: OriginalSupabaseProvider, useSupabase } =
  createRequiredContext<AppSupabaseClient>().with({ name: "supabase" });

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<AppSupabaseClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = createBrowserClient();
  }
  return (
    <OriginalSupabaseProvider supabase={clientRef.current}>
      {children}
    </OriginalSupabaseProvider>
  );
}
