import { createGenericComponent } from "@/components/generic";
import { forwardRef, ReactNode } from "react";
import { bemHelper } from "@/util";
import { Button as AriaButton } from "react-aria-components";
import { IconButton, IconButtonProps } from "./icon-button";
import { Button, ButtonProps } from "./button";
import "./card.scss";

export const cardTypes = [
  "default",
  "inverse",
  "success",
  "warning",
  "error",
  "info",
] as const;

type CardType = (typeof cardTypes)[number];
export interface CardProps {
  type?: CardType;
  className?: string;
  children?: ReactNode;
  withBg?: boolean;
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
  "div",
  (
    { children, type = "default", as: As, className, withBg, ...props },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls(
        undefined,
        {
          [type]: type !== "default",
          "with-bg": !!withBg,
        },
        className,
      )}
    >
      {withBg ? (
        <>
          <span className={cls("bg")} aria-hidden />
          <div className={cls("content")}>{children}</div>
        </>
      ) : (
        children
      )}
    </As>
  ),
);

Card.displayName = "Card";

interface CardSectionProps {
  className?: string;
  children?: ReactNode;
}

interface CardSectionPassedProps {
  className: string;
  children: ReactNode;
}

export const CardSection = createGenericComponent<
  "div",
  CardSectionProps,
  CardSectionPassedProps
>("div", ({ children, as: As, className, ...props }, ref) => (
  <As ref={ref} {...props} className={cls("section", undefined, className)}>
    <span className={cls("section__bg")} aria-hidden />
    <div className={cls("section-content")}>{children}</div>
  </As>
));

CardSection.displayName = "CardSection";

export const CardPrimaryAction = createGenericComponent<
  typeof AriaButton,
  CardSectionProps,
  CardSectionPassedProps
>(AriaButton, ({ children, className, ...props }, ref) => (
  <CardSection
    ref={ref}
    {...props}
    className={cls("section", "primary-action", className)}
  >
    {children}
  </CardSection>
));

export const CardActions = createGenericComponent<
  "div",
  CardSectionProps,
  CardSectionPassedProps
>("div", ({ children, className, ...props }, ref) => (
  <CardSection
    ref={ref}
    {...props}
    className={cls("section", "actions", className)}
  >
    {children}
  </CardSection>
));

CardActions.displayName = "CardActions";

export const CardActionButtons = createGenericComponent<
  "div",
  {
    className?: string;
    children?: ReactNode;
  },
  {
    className: string;
    children: ReactNode;
  }
>("div", ({ children, className, as: As, ...props }, ref) => (
  <As
    ref={ref}
    {...props}
    className={cls("action-buttons", undefined, className)}
  >
    {children}
  </As>
));

CardActionButtons.displayName = "CardActionButtons";

export const CardActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      className={cls("action", "button", className)}
    />
  ),
);

CardActionButton.displayName = "CardActionButton";

export const CardActionIcons = createGenericComponent<
  "div",
  {
    className?: string;
    children?: ReactNode;
  },
  {
    className: string;
    children: ReactNode;
  }
>("div", ({ children, className, as: As, ...props }, ref) => (
  <As
    ref={ref}
    {...props}
    className={cls("action-icons", undefined, className)}
  >
    {children}
  </As>
));

export const CardActionIcon = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => (
    <IconButton
      {...props}
      ref={ref}
      className={cls("action", "icon", className)}
    />
  ),
);

CardActionIcon.displayName = "CardActionIcon";
