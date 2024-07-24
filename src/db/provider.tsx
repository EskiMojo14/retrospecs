import type { Session } from "@supabase/supabase-js";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider as ReactQueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
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

export const { useSession, SessionProvider: OriginalSessionProvider } =
  createRequiredContext<Session | null>().with({
    name: "session",
  });

export function SessionProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);
  return (
    <OriginalSessionProvider session={session}>
      {children}
    </OriginalSessionProvider>
  );
}
