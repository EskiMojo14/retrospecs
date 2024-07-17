export const cardColors = [
  "inverse",
  "garden",
  "sun",
  "campfire",
  "fridge",
] as const;

export type CardColor = (typeof cardColors)[number];
