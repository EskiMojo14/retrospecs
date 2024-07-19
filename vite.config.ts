/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import RemixRouter from "vite-plugin-remix-router";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), RemixRouter()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test-setup.ts"],
  },
});
