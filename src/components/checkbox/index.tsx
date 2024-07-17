import { forwardRef } from "react";
import type { CheckboxProps as AriaCheckboxProps } from "react-aria-components";
import { Checkbox as AriaCheckbox } from "react-aria-components";
import { bemHelper } from "@/util";
import "./index.scss";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "className"> {
  className?: string;
  inverse?: boolean;
}

const containerCls = bemHelper("checkbox-container");
const cls = bemHelper("checkbox");

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, className, inverse, ...props }, ref) => (
    <AriaCheckbox
      {...props}
      ref={ref}
      className={containerCls(
        undefined,
        {
          inverse: !!inverse,
        },
        className,
      )}
    >
      {({ isIndeterminate }) => (
        <>
          <div className={cls()}>
            <svg
              className={cls("checkmark")}
              viewBox="0 0 18 18"
              aria-hidden="true"
            >
              {isIndeterminate ? (
                <rect x={1} y={7.5} width={15} height={3} />
              ) : (
                <polyline points="1 9 7 14 15 4" />
              )}
            </svg>
          </div>
          {children}
        </>
      )}
    </AriaCheckbox>
  ),
);

Checkbox.displayName = "Checkbox";
