import type { LinkProps } from "react-aria-components";
import { Button as AriaButton, Link } from "react-aria-components";
import { createGenericComponent } from "./generic";
import { bemHelper } from "@/util";
import type { Overwrite } from "@/util/types";
import "./button.scss";

export const buttonVariants = ["text", "outlined", "contained"] as const;

type ButtonVariant = (typeof buttonVariants)[number];

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
}

const cls = bemHelper("button");

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
  }
>(AriaButton, ({ variant = "text", className, as: As, ...props }, ref) => (
  <As
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
));

Button.displayName = "Button";

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
