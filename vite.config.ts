/// <reference types="vitest" />
import { vitePlugin as remix } from "@remix-run/dev";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ["**/*"],
      routes: (defineRoutes) => flatRoutes("routes", defineRoutes),
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "~": "/src",
      "@": "/app",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
  },
});
