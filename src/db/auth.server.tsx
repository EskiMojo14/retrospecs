import { redirect } from "@remix-run/react";
import type { AppLoadContext } from "~/load-context.server";

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
