/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="@vercel/remix" />

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [key: `--${string}`]: unknown;
  }
}
