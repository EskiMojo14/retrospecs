import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./server.ts"],
  sourcemap: true,
  external: [
    "compression",
    "express",
    "morgan",
    "vite",
    "vite/server",
    "./build/server/nodejs-eyJydW50aW1lIjoibm9kZWpzIn0/index.js",
  ],
  target: "node20",
  format: "esm",
  esbuildOptions(options) {
    options.outdir = ".";
  },
});
