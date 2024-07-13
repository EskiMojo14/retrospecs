import clsx from "clsx";
import { forwardRef } from "react";
import { CheckboxProps, Checkbox as AriaCheckbox } from "react-aria-components";
import "./checkbox.scss";

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ children, ...props }, ref) => (
    <AriaCheckbox
      {...props}
      ref={ref}
      className={clsx("checkbox-container", props.className)}
    >
      {({ isIndeterminate }) => (
        <>
          <div className="checkbox">
            <svg viewBox="0 0 18 18" aria-hidden="true">
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
