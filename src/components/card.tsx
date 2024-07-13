import { createGenericComponent } from "@/components/generic";
import { ReactNode } from "react";
import "./card.scss";
import { bemHelper } from "@/util";

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

const cls = bemHelper("card");

export const Card = createGenericComponent<"div", CardProps, CardPassedProps>(
  "div",
  ({ children, type = "default", as: As, className, ...props }, ref) => {
    return (
      <As
        ref={ref}
        {...props}
        className={cls(
          undefined,
          {
            [type]: type !== "default",
          },
          className,
        )}
      >
        <span className={cls("bg")} aria-hidden />
        <div className={cls("content")}>{children}</div>
      </As>
    );
  },
);

Card.displayName = "Card";
