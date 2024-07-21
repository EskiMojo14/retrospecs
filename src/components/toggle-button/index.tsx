import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { createContext, useMemo } from "react";
import type { ContextValue } from "react-aria-components";
import {
  ToggleButton as AriaToggleButton,
  Group,
  useContextProps,
} from "react-aria-components";
import {
  makeButtonSymbolSlots,
  type ButtonColor,
} from "~/components/button/constants";
import { createGenericComponent, renderPropChild } from "~/components/generic";
import { SymbolContext } from "~/components/symbol";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs } from "~/util";
import "./index.scss";

export interface ToggleButtonProps {
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
  unbounded?: boolean;
  isDisabled?: boolean;
}

const cls = bemHelper("toggle-button");

export const ToggleButtonContext =
  createContext<ContextValue<ToggleButtonProps, HTMLElement>>(null);

const buttonSymbolSlots = makeButtonSymbolSlots(cls);

export const ToggleButton = createGenericComponent<
  typeof AriaToggleButton,
  ToggleButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>("ToggleButton", AriaToggleButton, (props, ref) => {
  let unbounded;
  [{ unbounded, ...props }, ref] = useContextProps(
    props,
    ref as never,
    ToggleButtonContext,
  ) as [typeof props, typeof ref];
  const { surfaceProps, rootProps } = useRipple({
    disabled: props.isDisabled,
    unbounded,
  });
  const {
    className,
    as: As,
    color,
    compact,
    ref: rootRef,
    ...rest
  } = mergeProps(props, rootProps);
  return (
    <As
      ref={mergeRefs(ref, rootRef as never)}
      {...rest}
      className={cls({
        modifiers: {
          [color ?? ""]: !!color,
          compact: !!compact,
          unbounded: !!unbounded,
        },
        extra: className,
      })}
    >
      {renderPropChild(rest, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          <div {...surfaceProps} className={cls("ripple")} />
          {children}
        </SymbolContext.Provider>
      ))}
    </As>
  );
});

export const ToggleButtons = createGenericComponent<
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
  "ToggleButtons",
  "section",
  ({ className, as: As, children, orientation, ...props }, ref) => {
    return (
      <As
        ref={ref}
        {...props}
        className={clsx("toggle-buttons", className)}
        data-orientation={orientation}
      >
        {children}
      </As>
    );
  },
);

interface ToggleButtonGroupProps {
  children?: ReactNode;
  isDisabled?: boolean;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
}

export const ToggleButtonGroup = createGenericComponent<
  typeof Group,
  ToggleButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ToggleButtonGroup",
  Group,
  (
    { className, as: As, children, isDisabled, color, compact, ...props },
    ref,
  ) => {
    const contextValue = useMemo<ToggleButtonProps>(
      () => ({ color, compact, isDisabled }),
      [color, compact, isDisabled],
    );

    return (
      <As
        ref={ref}
        {...props}
        className={clsx("toggle-button-group", className)}
      >
        <ToggleButtonContext.Provider value={contextValue}>
          {children}
        </ToggleButtonContext.Provider>
      </As>
    );
  },
);
