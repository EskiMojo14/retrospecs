import { forwardRef } from "react";
import type { HeadingProps as AriaHeadingProps } from "react-aria-components";
import { Heading as AriaHeading } from "react-aria-components";
import { createGenericComponent } from "@/components/generic";
import { bemHelper } from "@/util";
import type { HeadingVariant, TypographyVariant } from "./constants";
import { levelMapping, variantMapping } from "./constants";
import "./index.scss";

export interface TypographyProps {
  variant: TypographyVariant;
  className?: string;
}

const cls = bemHelper("typography");

export const Typography = createGenericComponent<
  (typeof variantMapping)[keyof typeof variantMapping],
  TypographyProps,
  {
    className: string;
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

interface HeadingProps extends AriaHeadingProps {
  variant: HeadingVariant;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => (
    <Typography
      ref={ref}
      // @ts-expect-error TODO: not quite sure why this is unhappy
      as={AriaHeading}
      level={levelMapping[props.variant]}
      {...props}
    />
  ),
);

Heading.displayName = "Heading";
