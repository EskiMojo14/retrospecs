export const buttonVariants = ["text", "outlined", "contained"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonColors = [
  "default",
  "success",
  "warning",
  "error",
  "info",
] as const;

export type ButtonColor = (typeof buttonColors)[number];
