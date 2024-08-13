import type { CSSProperties, ReactNode } from "react";
import { Children, isValidElement, useMemo } from "react";
import { createGenericComponent } from "~/components/generic";
import type { Breakpoint } from "~/theme/layout";
import { bemHelper } from "~/util";
import "./index.scss";

const cls = bemHelper("grid");

export interface GridProps {
  className?: string;
  gutter?: number;
  children: ReactNode;
}

export const Grid = createGenericComponent<
  "div",
  GridProps,
  { className: string; children: ReactNode; style: CSSProperties }
>("Grid", "div", ({ as: As, className, children, gutter, ...props }, ref) => {
  const firstEl = Children.toArray(children)[0];
  const needsRow = !isValidElement(firstEl) || firstEl.type !== GridRow;
  return (
    <As
      {...props}
      ref={ref}
      className={cls({
        extra: className,
      })}
      style={{
        "--gutter": gutter + "px",
      }}
    >
      {needsRow ? <GridRow>{children}</GridRow> : children}
    </As>
  );
});

export const GridRow = createGenericComponent<
  "div",
  { className?: string },
  { className: string }
>("GridRow", "div", ({ as: As, className, ...props }, ref) => (
  <As
    {...props}
    ref={ref}
    className={cls({
      element: "row",
      extra: className,
    })}
  />
));

export interface GridCellProps {
  className?: string;
  start?: number;
  span?: number;
  breakpoints?: Partial<
    Record<
      Breakpoint,
      {
        start?: number;
        span?: number;
      }
    >
  >;
}

export const GridCell = createGenericComponent<
  "div",
  GridCellProps,
  { className: string; style: CSSProperties }
>(
  "GridCell",
  "div",
  ({ as: As, className, span, start, breakpoints, ...props }, ref) => {
    const breakpointVars = useMemo(
      () =>
        Object.fromEntries(
          Object.entries(breakpoints ?? {}).flatMap(([key, value]) => [
            ["--start-" + key, value.start],
            ["--span-" + key, value.span],
          ]),
        ),
      [breakpoints],
    );
    return (
      <As
        {...props}
        ref={ref}
        className={cls({
          element: "cell",
          extra: className,
        })}
        style={{
          "--start": start,
          "--span": span,
          ...breakpointVars,
        }}
      />
    );
  },
);

export const BreakpointDisplay = () =>
  process.env.NODE_ENV === "development" ? (
    <div className="breakpoint-display" />
  ) : null;
