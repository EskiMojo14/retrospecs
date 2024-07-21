import { mergeProps } from "@react-aria/utils";
import type { ForwardedRef, RefCallback } from "react";
import type { ContextValue } from "react-aria-components";
import BEMHelper from "react-bem-helper";

export function assert(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const bemHelper = BEMHelper.withDefaults({
  outputIsString: true,
});

export const safeAssign: <T extends object>(
  target: T,
  ...sources: Array<Partial<T>>
) => T = Object.assign;

export const toLowerCaseTyped = <T extends string>(value: T): Lowercase<T> =>
  value.toLowerCase() as Lowercase<T>;

export const toUpperCaseTyped = <T extends string>(value: T): Uppercase<T> =>
  value.toUpperCase() as Uppercase<T>;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const groupBy = <T, K extends PropertyKey, V = T>(
  array: Array<T>,
  key: (item: T, derived: V) => K,
  derive: (item: T) => V = (item) => item as never,
): Partial<Record<K, Array<V>>> =>
  array.reduce<Partial<Record<K, Array<V>>>>((acc, item) => {
    const derived = derive(item);
    (acc[key(item, derived)] ??= []).push(derived);
    return acc;
  }, {});

export const mapGroupBy = <T, K, V = T>(
  array: Array<T>,
  key: (item: T, derived: V) => K,
  derive: (item: T) => V = (item) => item as never,
): Map<K, Array<V>> =>
  array.reduce((acc, item) => {
    const derived = derive(item);
    emplace(acc, key(item, derived), {
      insert: () => [derived],
      update: (group) => {
        group.push(derived);
        return group;
      },
    });
    return acc;
  }, new Map<K, Array<V>>());

interface WeakMapEmplaceHandler<K extends object, V> {
  /**
   * Will be called to get value, if no value is currently in map.
   */
  insert?(key: K, map: WeakMap<K, V>): V;
  /**
   * Will be called to update a value, if one exists already.
   */
  update?(previous: V, key: K, map: WeakMap<K, V>): V;
}

interface MapEmplaceHandler<K, V> {
  /**
   * Will be called to get value, if no value is currently in map.
   */
  insert?(key: K, map: Map<K, V>): V;
  /**
   * Will be called to update a value, if one exists already.
   */
  update?(previous: V, key: K, map: Map<K, V>): V;
}

export function emplace<K, V>(
  map: Map<K, V>,
  key: K,
  handler: MapEmplaceHandler<K, V>,
): V;
export function emplace<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  handler: WeakMapEmplaceHandler<K, V>,
): V;
/**
 * Allow inserting a new value, or updating an existing one
 * @throws if called for a key with no current value and no `insert` handler is provided
 * @returns current value in map (after insertion/updating)
 * ```ts
 * // return current value if already in map, otherwise initialise to 0 and return that
 * const num = emplace(map, key, {
 *   insert: () => 0
 * })
 *
 * // increase current value by one if already in map, otherwise initialise to 0
 * const num = emplace(map, key, {
 *   update: (n) => n + 1,
 *   insert: () => 0,
 * })
 *
 * // only update if value's already in the map - and increase it by one
 * if (map.has(key)) {
 *   const num = emplace(map, key, {
 *     update: (n) => n + 1,
 *   })
 * }
 * ```
 *
 * @remarks
 * Based on https://github.com/tc39/proposal-upsert currently in Stage 2 - maybe in a few years we'll be able to replace this with direct method calls
 */
export function emplace<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  handler: WeakMapEmplaceHandler<K, V>,
): V {
  if (map.has(key)) {
    let value = map.get(key) as V;
    if (handler.update) {
      map.set(key, (value = handler.update(value, key, map)));
    }
    return value;
  }
  if (!handler.insert)
    throw new Error("No insert provided for key not already in map");
  let inserted;
  map.set(key, (inserted = handler.insert(key, map)));
  return inserted;
}

type NullishDefaults<T> = {
  [K in keyof T as T[K] extends NonNullable<T[K]> ? never : K]-?: NonNullable<
    T[K]
  >;
};

type WithoutNullish<T> = {
  [K in keyof T]-?: NonNullable<T[K]>;
};

/**
 * Set default values for nullish properties in an object
 */
export function defaultNullish<T>(
  value: T,
  defaults: NullishDefaults<T>,
): WithoutNullish<T> {
  const result = { ...value };
  let changed = false;
  for (const key in defaults) {
    if (result[key] == null) {
      result[key] = defaults[key];
      changed = true;
    }
  }
  return (changed ? result : value) as never;
}

export const mergeRefs =
  <T>(...refs: Array<ForwardedRef<T> | null | undefined>): RefCallback<T> =>
  (value) => {
    for (const ref of refs) {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };

export function mergeSlottedContext<T, El extends HTMLElement>(
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
    return { slots };
  }
  const slots = { ...parentValue.slots };
  if (!("slots" in value)) {
    for (const slot of Reflect.ownKeys(slots)) {
      slots[slot] = mergeProps(slots[slot], value) as never;
    }
  } else {
    for (const slot of Reflect.ownKeys(value.slots ?? {})) {
      slots[slot] = mergeProps(slots[slot], value.slots?.[slot]) as never;
    }
  }
  return { slots };
}
