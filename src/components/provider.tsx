import {
  useContext,
  useMemo,
  type Context,
  type Provider,
  type ReactNode,
} from "react";
import { mergeProps } from "react-aria";
import type { ContextValue } from "react-aria-components";

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

function mergeSlottedContext<T, El extends HTMLElement>(
  parentValue: ContextValue<T, El>,
  value: ContextValue<T, El>,
): ContextValue<T, El> {
  if (!parentValue) {
    return value;
  }
  if (!value) {
    return parentValue;
  }
  if (!("slots" in parentValue)) {
    if (!("slots" in value)) {
      return mergeProps(parentValue, value) as never;
    }
    const slots = { ...value.slots };
    for (const slot of Reflect.ownKeys(value.slots ?? {})) {
      slots[slot] = mergeProps(parentValue, value.slots?.[slot]) as never;
    }
    return { ...value, slots };
  }
  const slots = { ...parentValue.slots };
  if (!("slots" in value)) {
    for (const slot of Reflect.ownKeys(parentValue.slots ?? {})) {
      slots[slot] = mergeProps(parentValue.slots?.[slot], value) as never;
    }
  } else {
    for (const slot of Reflect.ownKeys(value.slots ?? {})) {
      slots[slot] = mergeProps(slots[slot], value.slots?.[slot]) as never;
    }
  }
  return { ...parentValue, slots };
}

export const MergeProvider = <T, El extends HTMLElement>({
  children,
  context,
  value,
}: {
  context: Context<ContextValue<T, El>>;
  value: ContextValue<T, El>;
  children: ReactNode;
}) => {
  const parentValue = useContext(context);
  const merged = useMemo(
    () => mergeSlottedContext(parentValue, value),
    [parentValue, value],
  );
  return <context.Provider value={merged}>{children}</context.Provider>;
};
