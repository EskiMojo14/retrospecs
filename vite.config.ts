/// <reference types="vitest" />
import localesPlugin from "@react-aria/optimize-locales-plugin";
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals();

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      ignoredRouteFiles: ["**/*.{scss,css}"],
      presets: [vercelPreset()],
    }),
    // Don't include any locale strings in the client JS bundle.
    { ...localesPlugin.vite({ locales: [] }), enforce: "pre" },
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
