import type { TypographyVariant } from "./constants";
import { variantMapping } from "./constants";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import "./index.scss";

export interface TypographyProps {
  variant: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

const cls = bemHelper("typography");

export const Typography = createGenericComponent<
  (typeof variantMapping)[keyof typeof variantMapping],
  TypographyProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "Typography",
  { getComponent: ({ variant }) => variantMapping[variant] },
  ({ variant, className, as: As, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={cls({ modifier: variant, extra: className })}
    />
  ),
);
