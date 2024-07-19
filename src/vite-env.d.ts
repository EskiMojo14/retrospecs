/// <reference types="vite/client" />
/// <reference types="vite-plugin-remix-router/client" />

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [key: `--${string}`]: unknown;
  }
}
