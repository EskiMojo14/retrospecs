import type { Provider, ReactNode } from "react";

type ProviderTuple<T> = [Provider<T>, T];

/**
 * A component that wraps a tree of components with multiple context providers.
 */
export function Provider<ContextValues extends Array<any>>({
  children,
  values,
}: {
  children: ReactNode;
  values: {
    [I in keyof ContextValues]: ProviderTuple<ContextValues[I]>;
  };
}) {
  return values.reduceRight(
    (acc, [Provider, value]) => <Provider value={value}>{acc}</Provider>,
    children,
  );
}
