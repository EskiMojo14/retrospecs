/* eslint-disable @typescript-eslint/no-unused-vars */
/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="@vercel/remix" />
/// <reference types="@remix-run/react/future/single-fetch.d.ts" />

declare module "csstype" {
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  export interface CSSProperties {
    [key: `--${string}`]: unknown;
  }
}

interface TextInfo {
  direction: "ltr" | "rtl";
}

namespace Intl {
  interface Locale {
    textInfo?: TextInfo;
    getTextInfo?(): TextInfo;
  }
}
