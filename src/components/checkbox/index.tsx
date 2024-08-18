import { forwardRef } from "react";
import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import { Checkbox as AriaCheckbox } from "react-aria-components";
import { useRipple } from "~/hooks/use-ripple";
import type { Color } from "~/theme/colors";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
import "./index.scss";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "className"> {
  className?: string;
  color?: Color;
}

const containerCls = bemHelper("checkbox-container");
const cls = bemHelper("checkbox");

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, className, color = "gold", ...props }, ref) => {
    const { rootRef, surfaceRef } = useRipple({
      disabled: props.isDisabled,
      unbounded: true,
    });
    return (
      <AriaCheckbox
        {...props}
        ref={mergeRefs(ref, rootRef)}
        className={containerCls({
          extra: [className ?? "", "color-" + color],
        })}
      >
        {renderPropsChild(children, (children, { isIndeterminate }) => (
          <>
            <div className={cls("target")}>
              <div ref={surfaceRef} className={cls("ripple", "unbounded")} />
              <div className={cls()}>
                <svg
                  className={cls("checkmark")}
                  viewBox="0 0 18 18"
                  aria-hidden="true"
                >
                  {isIndeterminate ? (
                    <rect x={2.5} y={7.5} width={13} height={3} />
                  ) : (
                    <polyline points="2.7,7.95 7.25,12.45 15.25,4.4" />
                  )}
                </svg>
              </div>
            </div>
            {children}
          </>
        ))}
      </AriaCheckbox>
    );
  },
);

Checkbox.displayName = "Checkbox";
