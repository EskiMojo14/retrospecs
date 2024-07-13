import clsx from "clsx";
import { createGenericComponent } from "./generic";
import { ReactNode } from "react";
import "./card.scss";

type CardType =
  | "default"
  | "inverse"
  | "success"
  | "warning"
  | "error"
  | "info";

interface CardProps {
  type?: CardType;
  className?: string;
  children?: ReactNode;
}

interface CardPassedProps {
  className: string;
  children: ReactNode;
}

export const Card = createGenericComponent<"div", CardProps, CardPassedProps>(
  "div",
  ({ children, type = "default", as: As, className, ...props }, ref) => {
    return (
      <As
        ref={ref}
        {...props}
        className={clsx(
          "card",
          {
            [`card--${type}`]: type !== "default",
          },
          className
        )}
      >
        <span className="card__bg" aria-hidden />
        <div className="card__content">{children}</div>
      </As>
    );
  }
);

Card.displayName = "Card";
