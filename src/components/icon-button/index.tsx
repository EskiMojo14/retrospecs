import { Button } from "@/components/button";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import "./index.scss";

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
>("IconButton", Button, ({ className, as: As, compact, ...props }, ref) => (
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
));
