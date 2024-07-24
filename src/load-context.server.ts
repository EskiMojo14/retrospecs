import type { AppLoadContext } from "@remix-run/node";
import type { Request } from "express";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { createServerClient } from "~/db/client.server";
import { makeQueryClient } from "~/db/query";
import type { BaseApi } from "~/features/api";
import { makeApi } from "~/features/api";
import type { AppStore } from "~/store";
import { makeStore } from "~/store";
import type { AppContext } from "~/util/supabase-query";

declare module "@remix-run/node" {
  interface AppLoadContext extends AppContext {
    lang: string;
    headers: Headers;
    store: AppStore;
    api: BaseApi;
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
