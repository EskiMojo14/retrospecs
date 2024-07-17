import type { ContextType } from "react";
import { DEFAULT_SLOT } from "react-aria-components";
import type { SymbolContext, SymbolProps } from "../symbol";
import { bemHelper } from "@/util";

export const buttonVariants = ["text", "outlined", "contained"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonColors = ["garden", "sun", "campfire", "fridge"] as const;

export type ButtonColor = (typeof buttonColors)[number];

const sharedIconProps: SymbolProps = {
  size: 18,
  weight: 700,
};

export const cls = bemHelper("button");

export const buttonSymbolSlots = {
  slots: {
    [DEFAULT_SLOT]: {},
    leading: { ...sharedIconProps, className: cls("icon", "leading") },
    trailing: { ...sharedIconProps, className: cls("icon", "trailing") },
  },
} satisfies ContextType<typeof SymbolContext>;
