import { clsx } from "clsx";
import type { ContextType } from "react";
import { useMemo } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext,
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
>(
  "ToggleButton",
  AriaToggleButton,
  ({ className, as: As, color = "default", inverse, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={cls(
        undefined,
        {
          [color]: color !== "default",
          inverse: !!inverse,
        },
        className,
      )}
    />
  ),
);

interface ToggleButtonGroupProps {
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

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
  ({ className, as: As, children, isDisabled, ...props }, ref) => {
    const ariaContextValue = useMemo<ContextType<typeof ToggleButtonContext>>(
      () => ({ isDisabled }),
      [isDisabled],
    );
    return (
      <As
        ref={ref}
        {...props}
        className={clsx("toggle-button-group", className)}
      >
        <ToggleButtonContext.Provider value={ariaContextValue}>
          {children}
        </ToggleButtonContext.Provider>
      </As>
    );
  },
);
