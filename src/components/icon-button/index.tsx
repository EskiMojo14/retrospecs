import type { TooltipTriggerProps } from "@react-types/tooltip";
import type { ContextType } from "react";
import { createContext } from "react";
import type { SlotProps, ContextValue } from "react-aria-components";
import { useContextProps } from "react-aria-components";
import { Button, ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import type { TooltipProps } from "~/components/tooltip";
import { Tooltip, TooltipTrigger } from "~/components/tooltip";
import { bemHelper } from "~/util";
import "./index.scss";

export interface IconButtonProps extends SlotProps {
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

export const IconButtonContext = createContext<
  ContextValue<IconButtonProps, HTMLElement>
>({});

export const IconButton = createGenericComponent<
  typeof Button,
  IconButtonProps,
  {
    className: string;
  }
>("IconButton", Button, (props, ref) => {
  [props, ref] = useContextProps(props, ref as never, IconButtonContext) as [
    typeof props,
    typeof ref,
  ];
  const {
    className,
    as: As,
    compact,
    tooltip,
    tooltipProps,
    tooltipTriggerProps,
    ...rest
  } = props;
  return (
    <MergeProvider context={ButtonContext} value={buttonContextValue}>
      <TooltipTrigger {...tooltipTriggerProps}>
        <As
          {...rest}
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
  );
});
