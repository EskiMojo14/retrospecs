import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useRef } from "react";
import { createRequiredContext } from "required-react-context";
import { createBrowserClient } from "./client";
import { makeQueryClient } from "./query";
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

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const clientRef = useRef<QueryClient | null>(null);
  if (!clientRef.current) {
    clientRef.current = makeQueryClient();
  }
  return (
    <ReactQueryClientProvider client={clientRef.current}>
      {children}
    </ReactQueryClientProvider>
  );
}
