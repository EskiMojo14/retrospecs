import { bemHelper } from "@/util";
import { forwardRef } from "react";
import {
  Button as AriaButton,
  ButtonProps as AriaButtonProps,
} from "react-aria-components";
import "./button.scss";

type ButtonVariant = "text" | "outlined" | "contained";

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
