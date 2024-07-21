import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import { createContext, forwardRef, useMemo, type ReactNode } from "react";
import type {
  LinkProps,
  ContextValue,
  ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  Group,
  Link,
  useContextProps,
} from "react-aria-components";
import {
  createGenericComponent,
  renderGenericPropChild,
} from "~/components/generic";
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
      {renderGenericPropChild(rest, (children) => (
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

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  Overwrite<LinkProps, ButtonProps>
>((props, ref) => <Button as={Link} {...props} ref={ref} />);

LinkButton.displayName = "LinkButton";

export type ToggleButtonProps = Overwrite<AriaToggleButtonProps, ButtonProps>;

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (props, ref) => <Button as={AriaToggleButton} {...props} ref={ref} />,
);

ToggleButton.displayName = "ToggleButton";

export const Buttons = createGenericComponent<
  "section",
  {
    children?: ReactNode;
    className?: string;
    orientation?: "horizontal" | "vertical";
  },
  {
    className: string;
    children: ReactNode;
    "data-orientation"?: "horizontal" | "vertical";
  }
>(
  "Buttons",
  "section",
  ({ className, as: As, children, orientation, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={clsx("buttons", className)}
      data-orientation={orientation}
    >
      {children}
    </As>
  ),
);

interface ButtonGroupProps
  extends Pick<ButtonProps, "color" | "variant" | "compact" | "isDisabled"> {
  children?: ReactNode;
  className?: string;
}

export const ButtonGroup = createGenericComponent<
  typeof Group,
  ButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ButtonGroup",
  Group,
  (
    {
      className,
      as: As,
      children,
      isDisabled,
      color,
      compact,
      variant,
      ...props
    },
    ref,
  ) => {
    const contextValue = useMemo<ButtonProps>(
      () => ({ color, compact, isDisabled, variant }),
      [color, compact, isDisabled, variant],
    );

    return (
      <As ref={ref} {...props} className={clsx("button-group", className)}>
        <ButtonContext.Provider value={contextValue}>
          {children}
        </ButtonContext.Provider>
      </As>
    );
  },
);
