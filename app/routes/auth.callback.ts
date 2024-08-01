import { redirect } from "@vercel/remix";
import { createLoader } from "~/db/loader.server";

export const loader = createLoader(
  async ({ request, context: { supabase, headers } }) => {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");
    if (error ?? errorDescription) {
      return redirect(
        `/sign-in?error=${error}&error_description=${errorDescription}`,
      );
    }
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/";
    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          return redirect(next, { headers });
        }
        return redirect(`/sign-in?error=${error.message}`);
      } catch (error) {
        return redirect(
          `/sign-in?error=${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    return redirect("/sign-in?error=No code provided");
  },
);

export default () => null;
