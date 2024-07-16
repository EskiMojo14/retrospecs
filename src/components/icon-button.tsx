import { Button } from "./button";
import { createGenericComponent } from "./generic";
import { bemHelper } from "@/util";
import "./icon-button.scss";

export interface IconButtonProps {
  className?: string;
  compact?: boolean;
}

const cls = bemHelper("icon-button");

export const IconButton = createGenericComponent<
  typeof Button,
  IconButtonProps,
  {
    className: string;
  }
>(Button, ({ className, as: As, compact, ...props }, ref) => (
  <As
    {...props}
    ref={ref}
    className={cls(
      undefined,
      {
        compact: !!compact,
      },
      className,
    )}
  />
));

IconButton.displayName = "IconButton";
