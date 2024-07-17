import { createGenericComponent } from "@/components/generic";
import { ToggleButton } from "@/components/toggle-button";
import { bemHelper } from "@/util";
import "@/components/icon-button/index.scss";

export interface IconToggleButtonProps {
  className?: string;
  compact?: boolean;
}

const cls = bemHelper("icon-button");

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
    <As
      {...props}
      ref={ref}
      className={cls(undefined, { compact: !!compact }, className)}
    />
  ),
);
