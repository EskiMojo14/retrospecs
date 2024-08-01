import { redirect } from "@vercel/remix";
import { createLoader } from "~/db/loader.server";

export const loader = createLoader(async ({ context: { supabase } }) => {
  await supabase.auth.signOut();
  return redirect("/sign-in");
});

export default () => null;
