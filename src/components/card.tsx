import clsx from "clsx";
import { createGenericComponent } from "./generic";
import { ReactNode } from "react";
import "./card.scss";

interface CardProps {
  inverse?: boolean;
  className?: string;
  children?: ReactNode;
}

interface CardPassedProps {
  className: string;
  children: ReactNode;
}

export const Card = createGenericComponent<"div", CardProps, CardPassedProps>(
  "div",
  ({ children, inverse = false, as: As, className, ...props }, ref) => {
    return (
      <As
        ref={ref}
        {...props}
        className={clsx("card", inverse && "card--inverse", className)}
      >
        <span className="card__bg" aria-hidden />
        <div className="card__content">{children}</div>
      </As>
    );
  }
);

Card.displayName = "Card";
