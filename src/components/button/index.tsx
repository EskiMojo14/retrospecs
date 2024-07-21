import { mergeProps } from "@react-aria/utils";
import { createContext, type ReactNode } from "react";
import type { LinkProps, ContextValue } from "react-aria-components";
import {
  Button as AriaButton,
  Link,
  useContextProps,
} from "react-aria-components";
import { createGenericComponent, renderPropChild } from "~/components/generic";
import { SymbolContext } from "~/components/symbol";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonColor, ButtonVariant } from "./constants";
import { makeButtonSymbolSlots } from "./constants";
import "./index.scss";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
  isDisabled?: boolean;
  unbounded?: boolean;
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
  let unbounded;
  [{ unbounded, ...props }, ref] = useContextProps(
    props,
    ref as never,
    ButtonContext,
  ) as [typeof props, typeof ref];
  const { surfaceProps, rootProps } = useRipple({
    disabled: props.isDisabled,
    unbounded,
  });
  const {
    variant = "text",
    color,
    compact,
    className,
    as: As,
    ref: rootRef,
    ...rest
  } = mergeProps(props, rootProps);
  return (
    <As
      {...rest}
      ref={mergeRefs(ref, rootRef as never)}
      className={cls({
        modifiers: {
          [variant]: true,
          [color ?? ""]: !!color,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderPropChild(rest, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          <div
            className={cls("ripple", { unbounded: !!unbounded })}
            {...surfaceProps}
          />
          <div className={cls("content")}>{children}</div>
        </SymbolContext.Provider>
      ))}
    </As>
  );
});

export const LinkButton = (props: Overwrite<LinkProps, ButtonProps>) => (
  <Button as={Link} {...props} />
);
