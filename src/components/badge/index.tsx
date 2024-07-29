import type { CSSProperties, ReactNode } from "react";
import { createGenericComponent } from "~/components/generic";
import type { Color } from "~/theme/colors";
import { bemHelper } from "~/util";
import type { OneOf } from "~/util/types";
import "./index.scss";

type VariantProps = OneOf<
  | {
      variant?: "standard";
      badgeContent?: ReactNode;
      showZero?: boolean;
      max?: number;
    }
  | {
      variant: "dot";
    }
>;

export type BadgeProps = VariantProps & {
  overlap?: "circle" | "rectangle";
  color?: Color;
  collapsed?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export interface BadgePassedProps {
  className: string;
  children: ReactNode;
}

const cls = bemHelper("badge");

export const Badge = createGenericComponent<
  "span",
  BadgeProps,
  BadgePassedProps
>(
  "Badge",
  "span",
  (
    {
      as: As,
      badgeContent,
      showZero,
      max = Infinity,
      color = "gold",
      collapsed: propCollapsed,
      children,
      className,
      variant = "standard",
      overlap = "rectangle",
      ...props
    },
    ref,
  ) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const collapsed = propCollapsed || (badgeContent === 0 && !showZero);
    const content =
      typeof badgeContent === "number" && max < badgeContent
        ? `${max}+`
        : badgeContent;
    return (
      <As
        ref={ref}
        {...props}
        className={cls({
          modifiers: {
            [color]: true,
            [variant]: true,
            ["overlap-" + overlap]: true,
            collapsed,
          },
          extra: className,
        })}
      >
        {children}
        <span className={cls("badge")}>
          {variant === "dot" ? null : content}
        </span>
      </As>
    );
  },
);
