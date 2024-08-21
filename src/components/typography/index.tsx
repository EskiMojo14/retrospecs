import type { HTMLAttributes, ReactNode, TimeHTMLAttributes } from "react";
import { forwardRef, useSyncExternalStore } from "react";
import type { HeadingProps as AriaHeadingProps } from "react-aria-components";
import {
  Heading as AriaHeading,
  Header as AriaHeader,
} from "react-aria-components";
import { createGenericComponent } from "~/components/generic";
import { bemHelper } from "~/util";
import type { Overwrite, PickRequired } from "~/util/types";
import type { HeadingVariant, TypographyVariant } from "./constants";
import { levelMapping, variantMapping } from "./constants";
import "./index.scss";

export interface TypographyProps {
  variant: TypographyVariant;
  noMargin?: boolean;
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
  ({ variant, noMargin = true, className, as: As, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={cls({
        modifier: {
          "no-margin": noMargin,
          [variant]: true,
        },
        extra: className,
      })}
    />
  ),
);

type HeadingProps = Overwrite<
  AriaHeadingProps,
  Overwrite<TypographyProps, { variant: HeadingVariant }>
>;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (props, ref) => (
    <Typography
      ref={ref}
      as={AriaHeading}
      level={levelMapping[props.variant]}
      {...props}
    />
  ),
);

Heading.displayName = "Heading";

type HeaderProps = Overwrite<
  HTMLAttributes<HTMLElement>,
  Overwrite<TypographyProps, { variant: HeadingVariant }>
>;

export const Header = forwardRef<HTMLElement, HeaderProps>((props, ref) => (
  <Typography ref={ref} as={AriaHeader} {...props} />
));

Header.displayName = "Header";

type TimeProps = Overwrite<
  PickRequired<TimeHTMLAttributes<HTMLTimeElement>, "dateTime">,
  { children: (date: Date) => ReactNode }
>;

const emptySubscribe = () => () => {};

export const Time = forwardRef<HTMLTimeElement, TimeProps>(
  ({ dateTime, children, ...rest }, ref) => {
    const dateObj = new Date(dateTime);
    const date = useSyncExternalStore(
      emptySubscribe,
      () => children(dateObj),
      () => dateObj.toISOString(),
    );
    return (
      <time ref={ref} dateTime={dateTime} {...rest}>
        {date}
      </time>
    );
  },
);

Time.displayName = "Time";
