import type { ReactNode } from "react";
import { useHydrate } from "~/hooks/use-hydrating-loader-data";

export function HydrationBoundary({
  children,
  state,
}: {
  children: ReactNode;
  state: Parameters<typeof useHydrate>[0];
}) {
  useHydrate(state);
  return children;
}
