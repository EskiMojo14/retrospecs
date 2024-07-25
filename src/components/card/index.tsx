import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import type { ContextType, ReactNode } from "react";
import { Button as AriaButton, DEFAULT_SLOT } from "react-aria-components";
import type { ButtonProps } from "~/components/button";
import { Button, ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { IconButton } from "~/components/icon-button";
import { Provider } from "~/components/provider";
import { ToolbarContext } from "~/components/toolbar";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs } from "~/util";
import type { CardColor, CardVariant } from "./constants";
import "./index.scss";

export interface CardProps {
  color?: CardColor;
  className?: string;
  children?: ReactNode;
  variant?: CardVariant;
}

const cls = bemHelper("card");

const toolbarContextValue: ContextType<typeof ToolbarContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    buttons: { align: "start" },
    icons: { align: "end" },
  },
};

const buttonContextValue: ContextType<typeof ButtonContext> = {
  color: "brown",
};

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
    { children, color, as: As, className, variant = "filled", ...props },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls({
        modifiers: {
          [color ?? ""]: !!color,
          [variant]: true,
        },
        extra: className,
      })}
    >
      <Provider
        values={[
          [ToolbarContext, toolbarContextValue],
          [ButtonContext, buttonContextValue],
        ]}
      >
        {children}
      </Provider>
    </As>
  ),
);

interface CardSectionProps {
  className?: string;
  children?: ReactNode;
  outsideContent?: ReactNode;
}

interface CardSectionPassedProps {
  className: string;
  children: ReactNode;
}

export const CardSection = createGenericComponent<
  "section",
  CardSectionProps,
  CardSectionPassedProps
>(
  "CardSection",
  "section",
  ({ children, as: As, className, outsideContent, ...props }, ref) => (
    <As ref={ref} {...props} className={cls("section", undefined, className)}>
      <span className={cls("section__bg")} />
      {outsideContent}
      <div className={cls("section-content")}>{children}</div>
    </As>
  ),
);

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
      className={clsx("section--primary-action", className)}
      outsideContent={
        <span {...surfaceProps} className={cls("section-ripple")} />
      }
    >
      {children}
    </CardSection>
  );
});

export const CardActions = createGenericComponent<
  "section",
  CardSectionProps,
  CardSectionPassedProps
>("CardActions", "section", ({ children, className, ...props }, ref) => (
  <CardSection
    ref={ref}
    {...props}
    className={cls("section", "actions", className)}
  >
    {children}
  </CardSection>
));

export const CardActionButton = createGenericComponent<
  typeof Button,
  ButtonProps,
  {
    className: string;
  }
>("CardActionButton", Button, ({ className, as: As, ...props }, ref) => (
  <As {...props} ref={ref} className={cls("action", "button", className)} />
));

export const CardActionIcon = createGenericComponent<
  typeof IconButton,
  { className?: string },
  {
    className: string;
  }
>("CardActionIcon", IconButton, ({ className, as: As, ...props }, ref) => (
  <As {...props} ref={ref} className={cls("action", "icon", className)} />
));
