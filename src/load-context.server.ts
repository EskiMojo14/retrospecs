import type { AppLoadContext } from "@remix-run/node";
import type { Request } from "express";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { createServerClient } from "~/db/client.server";
import { makeQueryClient } from "~/db/query";
import type { AppContext } from "~/util/supabase-query";

declare module "@remix-run/node" {
  interface AppLoadContext extends AppContext {
    lang: string;
    headers: Headers;
  }
}

export const getLoadContext = (request: Request): AppLoadContext => {
  return {
    lang:
      parseAcceptLanguage(request.headers["accept-language"] ?? "")[0] ?? "",
    ...createServerClient(request),
    queryClient: makeQueryClient(),
  };
};
