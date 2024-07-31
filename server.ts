// @ts-check
import { existsSync } from "fs";
import type { ServerBuild } from "@remix-run/server-runtime";
import { createRequestHandler } from "@vercel/remix/server";
import compression from "compression";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

const dotEnvPaths = [
  `.env.${process.env.NODE_ENV}`,
  `.env.${process.env.NODE_ENV}.local`,
  ".env",
  ".env.local",
].filter((file) => existsSync(file));

dotenv.config({
  path: dotEnvPaths,
});

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
    : await import(
        "./build/server/nodejs-eyJydW50aW1lIjoibm9kZWpzIn0/index.js"
      ),
  mode: process.env.NODE_ENV,
  getLoadContext: await import("./src/load-context.server").then(
    (m) => m.getLoadContext,
  ),
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});

export default remixHandler;
