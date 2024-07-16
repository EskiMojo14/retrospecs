import { forwardRef } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Button as AriaButton } from "react-aria-components";
import { bemHelper } from "@/util";
import "./button.scss";

export const buttonVariants = ["text", "outlined", "contained"] as const;

type ButtonVariant = (typeof buttonVariants)[number];

export interface ButtonProps extends Omit<AriaButtonProps, "className"> {
  variant?: ButtonVariant;
  className?: string;
}

const cls = bemHelper("button");

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "text", className, ...props }, ref) => (
    <AriaButton
      ref={ref}
      {...props}
      className={cls(
        undefined,
        {
          [variant]: true,
        },
        className,
      )}
    />
  ),
);

Button.displayName = "Button";
