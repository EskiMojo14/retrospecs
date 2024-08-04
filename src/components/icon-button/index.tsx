import type { TooltipTriggerProps } from "@react-types/tooltip";
import type { ContextType } from "react";
import { forwardRef } from "react";
import { TooltipTrigger } from "react-aria-components";
import type { ToggleButtonProps } from "~/components/button";
import { Button, ButtonContext, ToggleButton } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import type { TooltipProps } from "~/components/tooltip";
import { Tooltip } from "~/components/tooltip";
import { bemHelper } from "~/util";
import type { Overwrite } from "~/util/types";
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

export const IconToggleButton = forwardRef<
  HTMLButtonElement,
  Overwrite<ToggleButtonProps, IconButtonProps>
>((props, ref) => <IconButton as={ToggleButton} {...props} ref={ref} />);

IconToggleButton.displayName = "IconToggleButton";
