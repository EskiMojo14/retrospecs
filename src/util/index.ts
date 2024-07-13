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
