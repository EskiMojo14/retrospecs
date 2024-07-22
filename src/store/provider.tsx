import type { ReactNode } from "react";
import { useRef } from "react";
import { Provider } from "react-redux";
import { createRequiredContext } from "required-react-context";
import type { BaseApi } from "~/features/api";
import { makeApi } from "~/features/api";
import type { AppStore } from ".";
import { makeStore } from ".";

export const { useApi, ApiProvider } = createRequiredContext<BaseApi>().with({
  name: "api",
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef<BaseApi | null>(null);
  if (!apiRef.current) {
    apiRef.current = makeApi();
  }
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return (
    <ApiProvider api={apiRef.current}>
      <Provider store={storeRef.current}>{children}</Provider>
    </ApiProvider>
  );
}
