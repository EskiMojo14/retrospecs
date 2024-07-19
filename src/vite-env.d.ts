/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [key: `--${string}`]: unknown;
  }
}
