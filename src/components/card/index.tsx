import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";
import type { CardType } from "./constants";
import type { ButtonProps } from "@/components/button";
import { Button } from "@/components/button";
import { createGenericComponent } from "@/components/generic";
import { IconButton } from "@/components/icon-button";
import { bemHelper } from "@/util";
import "./index.scss";

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
  "Card",
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
>("CardSection", "div", ({ children, as: As, className, ...props }, ref) => (
  <As ref={ref} {...props} className={cls("section", undefined, className)}>
    <span className={cls("section__bg")} aria-hidden />
    <div className={cls("section-content")}>{children}</div>
  </As>
));

export const CardPrimaryAction = createGenericComponent<
  typeof AriaButton,
  CardSectionProps,
  CardSectionPassedProps
>("CardPrimaryAction", AriaButton, ({ children, className, ...props }, ref) => (
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
>("CardActions", "div", ({ children, className, ...props }, ref) => (
  <CardSection
    ref={ref}
    {...props}
    className={cls("section", "actions", className)}
  >
    {children}
  </CardSection>
));

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
>(
  "CardActionButtons",
  "div",
  ({ children, className, as: As, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={cls("action-buttons", undefined, className)}
    >
      {children}
    </As>
  ),
);

export const CardActionButton = createGenericComponent<
  typeof Button,
  ButtonProps,
  {
    className: string;
  }
>("CardActionButton", Button, ({ className, as: As, ...props }, ref) => (
  <As {...props} ref={ref} className={cls("action", "button", className)} />
));

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
>(
  "CardActionIcons",
  "div",
  ({ children, className, as: As, ...props }, ref) => (
    <As
      ref={ref}
      {...props}
      className={cls("action-icons", undefined, className)}
    >
      {children}
    </As>
  ),
);

export const CardActionIcon = createGenericComponent<
  typeof IconButton,
  { className?: string },
  {
    className: string;
  }
>("CardActionIcon", IconButton, ({ className, as: As, ...props }, ref) => (
  <As {...props} ref={ref} className={cls("action", "icon", className)} />
));
