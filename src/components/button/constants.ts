export const buttonVariants = ["text", "outlined", "contained"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonColors = ["garden", "sun", "campfire", "fridge"] as const;

export type ButtonColor = (typeof buttonColors)[number];
