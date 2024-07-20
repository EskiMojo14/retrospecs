export const cardColors = ["green", "blue", "yellow", "orange", "red"] as const;

export type CardColor = (typeof cardColors)[number];

export const cardVariants = ["filled", "raised"] as const;

export type CardVariant = (typeof cardVariants)[number];
