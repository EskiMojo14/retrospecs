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
  ...sources: Partial<T>[]
) => T = Object.assign;

export const toLowerCaseTyped = <T extends string>(value: T): Lowercase<T> =>
  value.toLowerCase() as Lowercase<T>;

export const toUpperCaseTyped = <T extends string>(value: T): Uppercase<T> =>
  value.toUpperCase() as Uppercase<T>;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const groupBy = <T, K extends PropertyKey>(
  array: T[],
  key: (item: T) => K,
): Partial<Record<K, T[]>> =>
  array.reduce<Partial<Record<K, T[]>>>((acc, item) => {
    (acc[key(item)] ??= []).push(item);
    return acc;
  }, {});

export const mapGroupBy = <T, K>(
  array: T[],
  key: (item: T) => K,
): Map<K, T[]> =>
  array.reduce((acc, item) => {
    emplace(acc, key(item), {
      insert: () => [item],
      update: (group) => {
        group.push(item);
        return group;
      },
    });
    return acc;
  }, new Map<K, T[]>());

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
