import { useCallback, useMemo, useSyncExternalStore } from "react";
import { useHydrated } from "remix-utils/use-hydrated";

export function useMediaQuery(query: string) {
  const isHydrated = useHydrated();
  const mediaQueryList = useMemo(
    () => (isHydrated ? window.matchMedia(query) : null),
    [query, isHydrated],
  );
  return useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        if (!mediaQueryList) return () => {};
        mediaQueryList.addEventListener("change", onStoreChange);
        return () => {
          mediaQueryList.removeEventListener("change", onStoreChange);
        };
      },
      [mediaQueryList],
    ),
    () => mediaQueryList?.matches ?? false,
    () => false,
  );
}
