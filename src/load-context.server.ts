import type { AppLoadContext } from "@remix-run/node";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import type { AppSupabaseClient } from "./db";
import { createServerClient } from "./db/client.server";
import type { AppStore } from "./store";
import { makeStore } from "./store";
import type { Request } from "express";

declare module "@remix-run/node" {
  interface AppLoadContext {
    lang: string;
    supabase: AppSupabaseClient;
    headers: Headers;
    store: AppStore;
  }
}

export const getLoadContext = (request: Request): AppLoadContext => ({
  lang: parseAcceptLanguage(request.headers["accept-language"] ?? "")[0] ?? "",
  ...createServerClient(request),
  store: makeStore(),
});
