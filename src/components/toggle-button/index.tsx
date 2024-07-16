import { clsx } from "clsx";
import type { ContextType } from "react";
import { useMemo } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonContext,
} from "react-aria-components";
import { createGenericComponent } from "@/components/generic";
import "./index.scss";

export interface ToggleButtonProps {
  className?: string;
}

export const ToggleButton = createGenericComponent<
  typeof AriaToggleButton,
  ToggleButtonProps,
  {
    className: string;
  }
>("ToggleButton", AriaToggleButton, ({ className, as: As, ...props }, ref) => (
  <As ref={ref} {...props} className={clsx("toggle-button", className)} />
));

interface ToggleButtonGroupProps {
  isDisabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const ToggleButtonGroup = createGenericComponent<
  "div",
  ToggleButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ToggleButtonGroup",
  "div",
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
