import type { ContextType } from "react";
import type { LinkProps } from "react-aria-components";
import {
  Button as AriaButton,
  DEFAULT_SLOT,
  Link,
} from "react-aria-components";
import type { ButtonColor, ButtonVariant } from "./constants";
import { createGenericComponent } from "@/components/generic";
import { SymbolContext } from "@/components/symbol";
import { bemHelper } from "@/util";
import type { Overwrite } from "@/util/types";
import "./index.scss";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  /** For display on a dark background. */
  inverse?: boolean;
  children?: React.ReactNode;
}

const cls = bemHelper("button");

const symbolContextValue: ContextType<typeof SymbolContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    icon: { size: 18, weight: 700, className: cls("icon") },
  },
};

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
    children: React.ReactNode;
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
      children,
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
    >
      <SymbolContext.Provider value={symbolContextValue}>
        {children}
      </SymbolContext.Provider>
    </As>
  ),
);

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
