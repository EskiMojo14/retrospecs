import { clsx } from "clsx";
import type { ReactNode } from "react";
import { createContext, useMemo } from "react";
import type { ContextValue } from "react-aria-components";
import {
  ToggleButton as AriaToggleButton,
  useContextProps,
} from "react-aria-components";
import {
  makeButtonSymbolSlots,
  type ButtonColor,
} from "~/components/button/constants";
import { createGenericComponent, renderPropChild } from "~/components/generic";
import { SymbolContext } from "~/components/symbol";
import { bemHelper } from "~/util";
import "./index.scss";

export interface ToggleButtonProps {
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
}

const cls = bemHelper("toggle-button");

const buttonSymbolSlots = makeButtonSymbolSlots(cls);

export const ToggleButton = createGenericComponent<
  typeof AriaToggleButton,
  ToggleButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>("ToggleButton", AriaToggleButton, (props, ref) => {
  [props, ref] = useContextProps(
    props,
    ref as never,
    ToggleButtonGroupContext,
  ) as [typeof props, typeof ref];
  const { className, as: As, color, compact, ...rest } = props;
  return (
    <As
      ref={ref}
      {...rest}
      className={cls({
        modifiers: {
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

interface ToggleButtonGroupProps {
  children?: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
}

const ToggleButtonGroupContext = createContext<
  ContextValue<ToggleButtonProps, HTMLElement>
>({});

export const ToggleButtonGroup = createGenericComponent<
  "section",
  ToggleButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ToggleButtonGroup",
  "section",
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
        <ToggleButtonGroupContext.Provider value={contextValue}>
          {children}
        </ToggleButtonGroupContext.Provider>
      </As>
    );
  },
);
