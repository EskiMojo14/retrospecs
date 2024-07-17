import type { LinkProps } from "react-aria-components";
import { Button as AriaButton, Link } from "react-aria-components";
import type { ButtonColor, ButtonVariant } from "./constants";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import type { Overwrite } from "@/util/types";
import "./index.scss";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  /** For display on a dark background. */
  inverse?: boolean;
}

const cls = bemHelper("button");

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
  }
>(
  "Button",
  AriaButton,
  (
    {
      variant = "text",
      color = "default",
      inverse,
      className,
      as: As,
      ...props
    },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls(
        undefined,
        {
          [variant]: variant !== "text",
          [color]: color !== "default",
          inverse: !!inverse,
        },
        className,
      )}
    />
  ),
);

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
