export const cardColors = [
  "green",
  "blue",
  "amber",
  "orange",
  "red",
  "teal",
] as const;

export type CardColor = (typeof cardColors)[number];

export const cardVariants = ["filled", "raised"] as const;

export type CardVariant = (typeof cardVariants)[number];
