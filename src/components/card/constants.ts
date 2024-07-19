export const cardColors = [
  "inverse",
  "garden",
  "sun",
  "campfire",
  "fridge",
] as const;

export type CardColor = (typeof cardColors)[number];

export const cardVariants = ["filled", "raised"] as const;

export type CardVariant = (typeof cardVariants)[number];
