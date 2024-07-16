import type { LinkProps } from "react-aria-components";
import { Button as AriaButton, Link } from "react-aria-components";
import type { ButtonVariant } from "./constants";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import type { Overwrite } from "@/util/types";
import "./index.scss";

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
>(
  "Button",
  AriaButton,
  ({ variant = "text", className, as: As, ...props }, ref) => (
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
  ),
);

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
