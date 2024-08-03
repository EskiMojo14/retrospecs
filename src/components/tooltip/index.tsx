import { clsx } from "clsx";
import { forwardRef } from "react";
import type { TooltipProps as AriaTooltipProps } from "react-aria-components";
import { Tooltip as AriaTooltip } from "react-aria-components";
import "./index.scss";

export interface TooltipProps extends Omit<AriaTooltipProps, "className"> {
  className?: string;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, ...props }, ref) => (
    <AriaTooltip
      offset={4}
      {...props}
      ref={ref}
      className={clsx("tooltip", className)}
    />
  ),
);

Tooltip.displayName = "Tooltip";
