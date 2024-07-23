import type { AppLoadContext } from "@remix-run/node";
import { redirect } from "@remix-run/react";

export async function ensureAuthenticated({
  supabase,
  headers,
}: Pick<AppLoadContext, "supabase" | "headers">) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error ?? !user) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/sign-in", { headers });
  }
  return user;
}
