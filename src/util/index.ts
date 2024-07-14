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
