import type { ReactNode } from "react";
import { useRef } from "react";
import { Provider } from "react-redux";
import type { AppStore } from ".";
import { makeStore } from ".";

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
