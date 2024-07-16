export const cardTypes = [
  "default",
  "inverse",
  "success",
  "warning",
  "error",
  "info",
] as const;

export type CardType = (typeof cardTypes)[number];
