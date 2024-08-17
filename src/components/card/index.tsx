import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import type { ContextType, ReactNode } from "react";
import { useMemo } from "react";
import { Button as AriaButton, DEFAULT_SLOT } from "react-aria-components";
import type { ButtonProps } from "~/components/button";
import { ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { Provider } from "~/components/provider";
import { ToolbarContext } from "~/components/toolbar";
import { useRipple } from "~/hooks/use-ripple";
import type { Color } from "~/theme/colors";
import { bemHelper, mergeRefs } from "~/util";
import type { CardVariant } from "./constants";
import "./index.scss";

export interface CardProps {
  color?: Color;
  className?: string;
  children?: ReactNode;
  variant?: CardVariant;
}

const cls = bemHelper("card");

export const Card = createGenericComponent<
  "div",
  CardProps,
  {
    className: string;
    children: ReactNode;
  }
>(
  "Card",
  "div",
  (
    {
      children,
      color = "gold",
      as: As,
      className,
      variant = "raised",
      ...props
    },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls({
        modifiers: {
          [variant]: true,
        },
        extra: [className ?? "", "color-" + color],
      })}
    >
      <div className={cls("bg")} />
      <div className={cls("content")}>{children}</div>
    </As>
  ),
);

interface CardSectionProps {
  className?: string;
  children?: ReactNode;
}

interface CardSectionPassedProps {
  className: string;
  children?: ReactNode;
}

export const CardSection = createGenericComponent<
  "section",
  CardSectionProps,
  CardSectionPassedProps
>("CardSection", "section", ({ as: As, className, ...props }, ref) => (
  <As ref={ref} {...props} className={cls("section", undefined, className)} />
));

type RootProps = ReturnType<typeof useRipple>["rootProps"];

interface CardPrimaryActionProps extends CardSectionProps {
  isDisabled?: boolean;
}

interface CardPrimaryActionPassedProps
  extends CardSectionPassedProps,
    RootProps {}

export const CardPrimaryAction = createGenericComponent<
  typeof AriaButton,
  CardPrimaryActionProps,
  CardPrimaryActionPassedProps
>("CardPrimaryAction", AriaButton, ({ children, className, ...props }, ref) => {
  const {
    rootProps: { ref: rootRef, ...rootProps },
    surfaceProps,
  } = useRipple({ disabled: props.isDisabled });
  return (
    <CardSection
      {...(mergeProps(props, rootProps) as any)}
      ref={mergeRefs(ref, rootRef as never)}
      className={clsx("card__section--primary-action", className)}
    >
      <span {...surfaceProps} className={cls("section-ripple")} />
      {children}
    </CardSection>
  );
});

const toolbarContextValue: ContextType<typeof ToolbarContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    buttons: { align: "start" },
    icons: { align: "end" },
  },
};

interface CardActionsProps
  extends CardSectionProps,
    Pick<ButtonProps, "color"> {}

export const CardActions = createGenericComponent<
  "section",
  CardActionsProps,
  CardSectionPassedProps
>(
  "CardActions",
  "section",
  ({ children, className, color = "inherit", ...props }, ref) => {
    const buttonContextValue = useMemo(
      () => ({
        slots: {
          [DEFAULT_SLOT]: {},
          action: { color },
        },
      }),
      [color],
    );
    return (
      <CardSection
        ref={ref}
        {...props}
        className={cls("section", "actions", className)}
      >
        <Provider
          values={[
            [ToolbarContext, toolbarContextValue],
            [ButtonContext, buttonContextValue],
          ]}
        >
          {children}
        </Provider>
      </CardSection>
    );
  },
);
