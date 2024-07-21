import type { ContextType } from "react";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import { ToggleButton, ToggleButtonContext } from "~/components/toggle-button";
import { bemHelper } from "~/util";
import "~/components/icon-button/index.scss";

export interface IconToggleButtonProps {
  className?: string;
  compact?: boolean;
}

const cls = bemHelper("icon-button");

const toggleButtonContextValue: ContextType<typeof ToggleButtonContext> = {
  unbounded: true,
};

export const IconToggleButton = createGenericComponent<
  typeof ToggleButton,
  IconToggleButtonProps,
  {
    className: string;
  }
>(
  "IconToggleButton",
  ToggleButton,
  ({ className, as: As, compact, ...props }, ref) => (
    <MergeProvider
      context={ToggleButtonContext}
      value={toggleButtonContextValue}
    >
      <As
        {...props}
        ref={ref}
        className={cls({ modifiers: { compact: !!compact }, extra: className })}
      />
    </MergeProvider>
  ),
);
