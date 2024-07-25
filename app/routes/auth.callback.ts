import type { LoaderFunctionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";

export const loader = async ({
  request,
  context: { supabase, headers },
}: LoaderFunctionArgs) => {
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next, { headers });
    }
    return redirect(`/sign-in?error=${error.message}`);
  }
  return redirect("/sign-in?error=No code provided");
};
