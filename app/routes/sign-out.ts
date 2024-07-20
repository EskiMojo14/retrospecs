import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader = (async ({ context }) => {
  const { supabase } = context;
  await supabase.auth.signOut();
  return redirect("/sign-in");
}) satisfies LoaderFunction;
