import { parseAcceptLanguage } from "intl-parse-accept-language";
import { createServerClient } from "~/db/client.server";
import { makeQueryClient } from "~/db/query";
import { mapEmplace } from "~/util/ponyfills";
import type { AppContext } from "./util/supabase-query";

export interface AppLoadContext extends AppContext {
  lang: string;
  headers: Headers;
}

const contextMap = new WeakMap<Request, AppLoadContext>();

export const getLoadContext = (request: Request): AppLoadContext => {
  return mapEmplace(contextMap, request, {
    insert: () => ({
      lang:
        parseAcceptLanguage(request.headers.get("accept-language") ?? "")[0] ??
        "",
      ...createServerClient(request),
      queryClient: makeQueryClient(),
    }),
  });
};
