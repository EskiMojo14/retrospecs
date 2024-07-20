import { redirect } from "@remix-run/react";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureAuthenticated({
  supabase,
  headers,
}: {
  supabase: SupabaseClient;
  headers: Headers;
}) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error ?? !user) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/sign-in", { headers });
  }
}
