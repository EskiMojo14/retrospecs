import { clsx } from "clsx";
import { ToggleButton as AriaToggleButton } from "react-aria-components";
import { createGenericComponent } from "@/components/generic";

interface ToggleButtonProps {
  className?: string;
}

export const ToggleButton = createGenericComponent<
  typeof AriaToggleButton,
  ToggleButtonProps,
  {
    className: string;
  }
>("ToggleButton", AriaToggleButton, ({ className, as: As, ...props }, ref) => (
  <As ref={ref} {...props} className={clsx("toggle-button", className)} />
));
