import type { ReactNode } from "react";
import type { LinkProps } from "react-aria-components";
import { Button as AriaButton, Link } from "react-aria-components";
import {
  makeButtonSymbolSlots,
  type ButtonColor,
  type ButtonVariant,
} from "./constants";
import { createGenericComponent, renderPropChild } from "@/components/generic";
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
  compact?: boolean;
}

const cls = bemHelper("button");

const buttonSymbolSlots = makeButtonSymbolSlots(cls);

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>(
  "Button",
  AriaButton,
  (
    { variant = "text", color, inverse, compact, className, as: As, ...props },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls({
        modifiers: {
          [variant]: variant !== "text",
          [color ?? ""]: !!color,
          inverse: !!inverse,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderPropChild(props, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          {children}
        </SymbolContext.Provider>
      ))}
    </As>
  ),
);

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
