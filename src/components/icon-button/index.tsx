import { forwardRef, type ContextType } from "react";
import type { ToggleButtonProps } from "~/components/button";
import { Button, ButtonContext, ToggleButton } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import { bemHelper } from "~/util";
import type { Overwrite } from "~/util/types";
import "./index.scss";

export interface IconButtonProps {
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
>("IconButton", Button, ({ className, as: As, compact, ...props }, ref) => (
  <MergeProvider context={ButtonContext} value={buttonContextValue}>
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
  </MergeProvider>
));

export const IconToggleButton = forwardRef<
  HTMLButtonElement,
  Overwrite<ToggleButtonProps, IconButtonProps>
>((props, ref) => <IconButton as={ToggleButton} {...props} ref={ref} />);

IconToggleButton.displayName = "IconToggleButton";
