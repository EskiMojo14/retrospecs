import type { ContextType, ReactNode, RefCallback } from "react";
import { createContext, forwardRef, useMemo } from "react";
import type {
  CheckboxProps as AriaCheckboxProps,
  CheckboxGroupProps as AriaCheckboxGroupProps,
  ContextValue,
} from "react-aria-components";
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  Label,
  Text,
  FieldError,
  useContextProps,
  DEFAULT_SLOT,
} from "react-aria-components";
import type { FormGroupProps } from "~/components/input/text-field";
import { listCls } from "~/components/list";
import { SymbolContext } from "~/components/symbol";
import { Typography } from "~/components/typography";
import { useRipple } from "~/hooks/use-ripple";
import type { Color } from "~/theme/colors";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
import "./index.scss";
import "~/components/list/index.scss";

const containerCls = bemHelper("checkbox-container");
const cls = bemHelper("checkbox");

const CheckboxTarget = ({
  isIndeterminate,
  rippleRef,
}: {
  isIndeterminate: boolean;
  rippleRef?: RefCallback<HTMLElement>;
}) => (
  <div className={cls("target")}>
    <div ref={rippleRef} className={cls("ripple", "unbounded")} />
    <div className={cls()}>
      <svg className={cls("checkmark")} viewBox="0 0 18 18" aria-hidden="true">
        {isIndeterminate ? (
          <rect x={2.5} y={7.5} width={13} height={3} />
        ) : (
          <polyline points="2.7,7.95 7.25,12.45 15.25,4.4" />
        )}
      </svg>
    </div>
  </div>
);

export interface CheckboxProps extends Omit<AriaCheckboxProps, "className"> {
  className?: string;
  color?: Color;
}

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
            <CheckboxTarget
              isIndeterminate={isIndeterminate}
              rippleRef={surfaceRef}
            />
            {children}
          </>
        ))}
      </AriaCheckbox>
    );
  },
);

Checkbox.displayName = "Checkbox";

interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "className">,
    FormGroupProps {
  color?: Color;
  className?: string;
}

type CheckboxGroupContextValue = ContextValue<
  Pick<CheckboxProps, "color">,
  HTMLElement
>;

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextValue>(null);

const groupCls = bemHelper("checkbox-group");

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      children,
      className,
      color,

      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      errorMessageProps,

      ...props
    },
    ref,
  ) => {
    const checkboxGroupContextValue = useMemo<CheckboxGroupContextValue>(
      () => ({ ...(color && { color }) }),
      [color],
    );
    return (
      <AriaCheckboxGroup
        {...props}
        ref={ref}
        className={groupCls({
          extra: className,
        })}
      >
        {renderPropsChild(children, (children) => (
          <CheckboxGroupContext.Provider value={checkboxGroupContextValue}>
            <Typography
              as={Label}
              variant="subtitle2"
              {...labelProps}
              className={groupCls({
                element: "label",
                extra: labelProps?.className,
              })}
            >
              {label}
            </Typography>
            <div className={listCls({ modifier: "one-line" })}>{children}</div>
            {description && (
              <Typography
                as={Text}
                slot="description"
                variant="body2"
                {...descriptionProps}
                className={groupCls({
                  element: "description",
                  extra: descriptionProps?.className,
                })}
              >
                {description}
              </Typography>
            )}
            <Typography
              as={FieldError}
              variant="body2"
              {...errorMessageProps}
              className={groupCls({
                element: "error-message",
                extra: errorMessageProps?.className,
              })}
            >
              {errorMessage}
            </Typography>
          </CheckboxGroupContext.Provider>
        ))}
      </AriaCheckboxGroup>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

const symbolContextValue: Record<
  `${boolean}`,
  ContextType<typeof SymbolContext>
> = {
  false: {
    slots: {
      [DEFAULT_SLOT]: {},
      icon: { className: listCls("icon"), transition: true },
    },
  },
  true: {
    slots: {
      [DEFAULT_SLOT]: {},
      icon: { className: listCls("icon"), fill: true, transition: true },
    },
  },
};

interface CheckboxItemProps extends CheckboxProps {
  icon?: ReactNode;
}

export const CheckboxItem = forwardRef<HTMLLabelElement, CheckboxItemProps>(
  (props, ref) => {
    [props, ref] = useContextProps(
      props,
      ref as never,
      CheckboxGroupContext,
    ) as [typeof props, typeof ref];
    const { color = "gold", className, children, icon, ...rest } = props;
    const checkboxRipple = useRipple({
      disabled: props.isDisabled,
      unbounded: true,
    });
    const itemRipple = useRipple({
      disabled: props.isDisabled,
    });

    return (
      <AriaCheckbox
        {...rest}
        ref={mergeRefs(ref, itemRipple.rootRef)}
        className={listCls({
          element: "item",
          extra: ["color-" + color, className ?? "", groupCls("item")],
        })}
      >
        {renderPropsChild(
          children,
          (children, { isIndeterminate, isSelected }) => (
            <SymbolContext.Provider
              value={symbolContextValue[`${isSelected || isIndeterminate}`]}
            >
              <div ref={itemRipple.surfaceRef} className={cls("item-ripple")} />
              <div className={listCls("item-content")}>
                {icon ?? (
                  <div ref={checkboxRipple.rootRef}>
                    <CheckboxTarget
                      isIndeterminate={isIndeterminate}
                      rippleRef={checkboxRipple.surfaceRef}
                    />
                  </div>
                )}
                {children}
                {icon != null && (
                  <div ref={checkboxRipple.rootRef}>
                    <CheckboxTarget
                      isIndeterminate={isIndeterminate}
                      rippleRef={checkboxRipple.surfaceRef}
                    />
                  </div>
                )}
              </div>
            </SymbolContext.Provider>
          ),
        )}
      </AriaCheckbox>
    );
  },
);

CheckboxItem.displayName = "CheckboxItem";
