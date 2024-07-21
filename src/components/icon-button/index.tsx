import type { ContextType } from "react";
import { Button, ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { MergeProvider } from "~/components/provider";
import { bemHelper } from "~/util";
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
