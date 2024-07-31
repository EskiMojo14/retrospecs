import type { LoaderFunction } from "@vercel/remix";
import { redirect } from "@vercel/remix";

export const loader = (async ({ context }) => {
  const { supabase } = context;
  await supabase.auth.signOut();
  return redirect("/sign-in");
}) satisfies LoaderFunction;
