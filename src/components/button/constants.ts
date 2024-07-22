export const buttonVariants = [
  "text",
  "outlined",
  "filled",
  "elevated",
] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonColors = [
  "blue",
  "green",
  "amber",
  "orange",
  "red",
  "brown",
] as const;

export type ButtonColor = (typeof buttonColors)[number];
