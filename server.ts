// @ts-check
import type { ServerBuild } from "@vercel/remix";
import { createRequestHandler } from "@vercel/remix/server";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import "./src/dotenv-setup.js";
import { getLoadContext } from "./src/load-context";

throw new Error("nuh uh");

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? ((await viteDevServer.ssrLoadModule(
        "virtual:remix/server-build",
      )) as ServerBuild)
    : ((await import(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line import/no-unresolved
        "./build/server/nodejs-eyJydW50aW1lIjoibm9kZWpzIn0/index.js"
      )) as ServerBuild),
  mode: process.env.NODE_ENV,
  getLoadContext,
});

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

export default remixHandler;
