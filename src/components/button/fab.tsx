import type { TooltipTriggerProps } from "@react-types/tooltip";
import type { ContextType } from "react";
import { forwardRef } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { MergeProvider } from "~/components/provider";
import { SymbolContext } from "~/components/symbol";
import type { TooltipProps } from "~/components/tooltip";
import { Tooltip, TooltipTrigger } from "~/components/tooltip";
import { bemHelper, renderPropsChild } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonProps } from ".";
import { Button } from ".";
import "./fab.scss";

export interface FabProps
  extends Omit<Overwrite<AriaButtonProps, ButtonProps>, "variant"> {
  tooltip: TooltipProps["children"];
  tooltipProps?: Omit<TooltipProps, "children">;
  tooltipTriggerProps?: TooltipTriggerProps;
  /** Defaults to "medium" */
  size?: "small" | "medium" | "large";
  exited?: boolean;
}

const cls = bemHelper("fab");

const largeFabSymbolContextValue: ContextType<typeof SymbolContext> = {
  size: 36,
};

export const Fab = forwardRef<HTMLButtonElement, FabProps>(
  (
    {
      size = "medium",
      className,
      children,
      exited,
      tooltip,
      tooltipProps,
      tooltipTriggerProps,
      ...props
    },
    ref,
  ) => (
    <TooltipTrigger {...tooltipTriggerProps}>
      <Button
        ref={ref}
        variant="filled"
        {...props}
        className={cls({
          modifiers: {
            [size]: true,
            exited: !!exited,
          },
          extra: className,
        })}
      >
        {renderPropsChild(children, (children) => (
          <MergeProvider
            context={SymbolContext}
            value={size === "large" ? largeFabSymbolContextValue : null}
          >
            {children}
          </MergeProvider>
        ))}
      </Button>
      <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
    </TooltipTrigger>
  ),
);

Fab.displayName = "FloatingActionButton";

const extendedCls = bemHelper("extended-fab");

const extendedSymbolContextValue: ContextType<typeof SymbolContext> = {
  size: 24,
};

export const ExtendedFab = forwardRef<
  HTMLButtonElement,
  Omit<FabProps, "size" | "tooltip">
>(({ className, children, exited, ...props }, ref) => (
  <Button
    ref={ref}
    variant="filled"
    {...props}
    className={extendedCls({
      modifiers: {
        exited: !!exited,
      },
      extra: className,
    })}
  >
    {renderPropsChild(children, (children) => (
      <MergeProvider context={SymbolContext} value={extendedSymbolContextValue}>
        {children}
      </MergeProvider>
    ))}
  </Button>
));

ExtendedFab.displayName = "ExtendedFloatingActionButton";
