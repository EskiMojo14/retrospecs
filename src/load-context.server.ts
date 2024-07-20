import type { AppLoadContext } from "@remix-run/node";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import type { AppSupabaseClient } from "./db";
import { createServerClient } from "./db/client.server";
import type { AppStore } from "./store";
import { makeStore } from "./store";

declare module "@remix-run/node" {
  interface AppLoadContext {
    lang: string;
    supabase: AppSupabaseClient;
    headers: Headers;
    store: AppStore;
  }
}

export const getLoadContext = ({
  request,
  context,
}: {
  request: Request;
  context: {};
}): AppLoadContext => ({
  ...context,
  lang:
    parseAcceptLanguage(request.headers.get("accept-language") ?? "")[0] ?? "",
  ...createServerClient(request),
  store: makeStore(),
});
