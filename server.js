// server.ts
import { createRequestHandler } from "@vercel/remix/server";
import compression from "compression";
import express from "express";
import morgan from "morgan";

// dotenv-setup.ts
import { existsSync } from "fs";
import dotenv from "dotenv";
var dotEnvPaths = [
  `.env.${process.env.NODE_ENV}`,
  `.env.${process.env.NODE_ENV}.local`,
  ".env",
  ".env.local"
].filter((file) => existsSync(file));
dotenv.config({
  path: dotEnvPaths
});

// src/load-context.server.ts
import { parseAcceptLanguage } from "intl-parse-accept-language";

// src/db/client.server.ts
import {
  createServerClient as createClient,
  parseCookieHeader,
  serializeCookieHeader
} from "@supabase/ssr";

// src/env.ts
import { object, parse, string } from "valibot";
var schema = object({
  VITE_SUPABASE_URL: string("VITE_SUPABASE_URL is required"),
  VITE_SUPABASE_ANON_KEY: string("VITE_SUPABASE_ANON_KEY is required")
});
var { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = parse(
  schema,
  import.meta.env ?? process.env
);

// src/db/client.server.ts
var createServerClient = (request) => {
  const headers = new Headers();
  const supabase = createClient(
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        }
      }
    }
  );
  return { supabase, headers };
};

// src/db/query.tsx
import { QueryClient, dehydrate } from "@tanstack/react-query";
var makeQueryClient = (staleTime = 1e3 * 60 * 5) => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime
    }
  }
});

// src/load-context.server.ts
var getLoadContext = (request) => {
  return {
    lang: parseAcceptLanguage(request.headers.get("accept-language") ?? "")[0] ?? "",
    ...createServerClient(request),
    queryClient: makeQueryClient()
  };
};

// server.ts
var viteDevServer = process.env.NODE_ENV === "production" ? void 0 : await import("vite").then(
  (vite) => vite.createServer({
    server: { middlewareMode: true }
  })
);
var remixHandler = createRequestHandler({
  build: viteDevServer ? await viteDevServer.ssrLoadModule(
    "virtual:remix/server-build"
  ) : await import("./build/server/nodejs-eyJydW50aW1lIjoibm9kZWpzIn0/index.js"),
  mode: process.env.NODE_ENV,
  getLoadContext
});
var app = express();
app.use(compression());
app.disable("x-powered-by");
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
}
app.use(express.static("build/client", { maxAge: "1h" }));
app.use(morgan("tiny"));
app.all("*", remixHandler);
var port = process.env.PORT ?? 3e3;
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
var server_default = remixHandler;
export {
  server_default as default
};
//# sourceMappingURL=server.js.map