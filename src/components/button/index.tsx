import { createContext, type ReactNode } from "react";
import type { LinkProps, ContextValue } from "react-aria-components";
import {
  Button as AriaButton,
  Link,
  useContextProps,
} from "react-aria-components";
import { createGenericComponent, renderPropChild } from "~/components/generic";
import { SymbolContext } from "~/components/symbol";
import { bemHelper } from "~/util";
import type { Overwrite } from "~/util/types";
import {
  makeButtonSymbolSlots,
  type ButtonColor,
  type ButtonVariant,
} from "./constants";
import "./index.scss";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
}

const cls = bemHelper("button");

const buttonSymbolSlots = makeButtonSymbolSlots(cls);

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLElement>>(null);

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>("Button", AriaButton, (props, ref) => {
  [props, ref] = useContextProps(props, ref as never, ButtonContext) as [
    typeof props,
    typeof ref,
  ];
  const {
    variant = "text",
    color,
    compact,
    className,
    as: As,
    ...rest
  } = props;
  return (
    <As
      ref={ref}
      {...rest}
      className={cls({
        modifiers: {
          [variant]: variant !== "text",
          [color ?? ""]: !!color,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderPropChild(rest, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          {children}
        </SymbolContext.Provider>
      ))}
    </As>
  );
});

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
