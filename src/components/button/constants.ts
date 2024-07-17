export const buttonVariants = ["text", "outlined", "contained"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];