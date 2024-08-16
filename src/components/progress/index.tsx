import type { CSSProperties } from "react";
import { forwardRef } from "react";
import type { ProgressBarProps } from "react-aria-components";
import { ProgressBar } from "react-aria-components";
import type { Color } from "~/theme/colors";
import { bemHelper, mergeRefs } from "~/util";
import "./index.scss";

export interface ProgressProps
  extends Omit<ProgressBarProps, "className" | "style"> {
  className?: string;
  color?: Color;
  isHidden?: boolean;
  thickness?: number;
  style?: CSSProperties;
}

const cls = bemHelper("progress");

export const LinearProgress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { color = "gold", className, isHidden, thickness, style, ...props },
    ref,
  ) => {
    return (
      <ProgressBar
        ref={ref}
        {...props}
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        data-hidden={isHidden || undefined}
        className={cls({
          modifier: {
            linear: true,
            [color]: true,
          },
          extra: className,
        })}
        style={{
          ...style,
          "--progress-thickness":
            typeof thickness === "number" ? `${thickness}px` : undefined,
        }}
      >
        {({ percentage = 0, isIndeterminate }) =>
          isIndeterminate ? null : (
            <div
              className={cls("bar")}
              style={{
                "--pct":
                  typeof percentage === "number" ? `${percentage}%` : undefined,
              }}
            >
              <div className={cls("bar-stop")} />
            </div>
          )
        }
      </ProgressBar>
    );
  },
);

LinearProgress.displayName = "LinearProgress";

export const CircularProgress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { color = "gold", className, isHidden = false, style, thickness, ...props },
    ref,
  ) => {
    return (
      <ProgressBar
        ref={mergeRefs(ref, (ref) => {
          if (!ref) return;
          ref.ariaHidden = isHidden.toString();
        })}
        {...props}
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        data-hidden={isHidden || undefined}
        className={cls({
          modifier: {
            circular: true,
            [color]: true,
          },
          extra: className,
        })}
        style={{
          ...style,
          "--progress-thickness":
            typeof thickness === "number" ? `${thickness}px` : undefined,
          "--progress-thickness-pct":
            typeof thickness === "number" ? (thickness / 40) * 100 : undefined,
        }}
      >
        {({ percentage = 0, isIndeterminate }) =>
          isIndeterminate ? (
            <div className={cls("spinner")}>
              <div className={cls("left")}>
                <svg viewBox="0 0 4800 4800">
                  <circle pathLength={100} />
                </svg>
              </div>
              <div className={cls("right")}>
                <svg viewBox="0 0 4800 4800">
                  <circle pathLength={100} />
                </svg>
              </div>
            </div>
          ) : (
            <svg
              viewBox="0 0 4800 4800"
              style={{
                "--pct": percentage,
              }}
            >
              <circle className={cls("track")} pathLength={100} />
              <circle className={cls("bar")} pathLength={100} />
              <circle className={cls("stop")} pathLength={100} />
            </svg>
          )
        }
      </ProgressBar>
    );
  },
);

CircularProgress.displayName = "CircularProgress";
