import { clsx } from "clsx";
import type { ContextType } from "react";
import { createContext, useMemo } from "react";
import type { ContextValue } from "react-aria-components";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext,
  useContextProps,
} from "react-aria-components";
import type { ButtonColor } from "@/components/button/constants";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import "./index.scss";

export interface ToggleButtonProps {
  className?: string;
  color?: ButtonColor;
  /** For display on a dark background. */
  inverse?: boolean;
}

const cls = bemHelper("toggle-button");

export const ToggleButton = createGenericComponent<
  typeof AriaToggleButton,
  ToggleButtonProps,
  {
    className: string;
  }
>("ToggleButton", AriaToggleButton, (props, ref) => {
  [props, ref] = useContextProps(
    props,
    ref as never,
    ToggleButtonGroupContext,
  ) as [typeof props, typeof ref];
  const { className, as: As, color = "default", inverse, ...rest } = props;
  return (
    <As
      ref={ref}
      {...rest}
      className={cls(
        undefined,
        {
          [color]: color !== "default",
          inverse: !!inverse,
        },
        className,
      )}
    />
  );
});

interface ToggleButtonGroupProps {
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
  color?: ButtonColor;
  inverse?: boolean;
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
    { className, as: As, children, isDisabled, inverse, color, ...props },
    ref,
  ) => {
    const ariaContextValue = useMemo<ContextType<typeof ToggleButtonContext>>(
      () => ({ isDisabled }),
      [isDisabled],
    );
    const contextValue = useMemo<ToggleButtonProps>(
      () => ({ color, inverse }),
      [color, inverse],
    );
    return (
      <As
        ref={ref}
        {...props}
        className={clsx("toggle-button-group", className)}
      >
        <ToggleButtonContext.Provider value={ariaContextValue}>
          <ToggleButtonGroupContext.Provider value={contextValue}>
            {children}
          </ToggleButtonGroupContext.Provider>
        </ToggleButtonContext.Provider>
      </As>
    );
  },
);
