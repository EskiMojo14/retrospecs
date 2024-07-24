import type { AppLoadContext } from "@remix-run/node";
import type { QueryClient } from "@tanstack/react-query";
import type { Request } from "express";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import type { AppSupabaseClient } from "./db";
import { createServerClient } from "./db/client.server";
import { makeQueryClient } from "./db/query";
import type { BaseApi } from "./features/api";
import { makeApi } from "./features/api";
import type { AppStore } from "./store";
import { makeStore } from "./store";

declare module "@remix-run/node" {
  interface AppLoadContext {
    lang: string;
    supabase: AppSupabaseClient;
    headers: Headers;
    store: AppStore;
    api: BaseApi;
    queryClient: QueryClient;
  }
}

export const getLoadContext = (request: Request): AppLoadContext => {
  const api = makeApi();
  return {
    lang:
      parseAcceptLanguage(request.headers["accept-language"] ?? "")[0] ?? "",
    ...createServerClient(request),
    api,
    store: makeStore({ api }),
    queryClient: makeQueryClient(),
  };
};
