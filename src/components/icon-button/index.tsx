import type { TooltipTriggerProps } from "@react-types/tooltip";
import type { ContextType } from "react";
import { Button, ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import type { TooltipProps } from "~/components/tooltip";
import { Tooltip, TooltipTrigger } from "~/components/tooltip";
import { bemHelper } from "~/util";
import "./index.scss";

export interface IconButtonProps {
  tooltip: string;
  tooltipProps?: TooltipProps;
  tooltipTriggerProps?: TooltipTriggerProps;
  className?: string;
  compact?: boolean;
}

const cls = bemHelper("icon-button");

const buttonContextValue: ContextType<typeof ButtonContext> = {
  unbounded: true,
};

export const IconButton = createGenericComponent<
  typeof Button,
  IconButtonProps,
  {
    className: string;
  }
>(
  "IconButton",
  Button,
  (
    {
      className,
      as: As,
      compact,
      tooltip,
      tooltipProps,
      tooltipTriggerProps,
      ...props
    },
    ref,
  ) => (
    <MergeProvider context={ButtonContext} value={buttonContextValue}>
      <TooltipTrigger {...tooltipTriggerProps}>
        <As
          {...props}
          ref={ref}
          className={cls({
            modifiers: {
              compact: !!compact,
            },
            extra: className,
          })}
        />
        <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
      </TooltipTrigger>
    </MergeProvider>
  ),
);
