import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import { createContext, forwardRef, useMemo, type ReactNode } from "react";
import type {
  LinkProps,
  ContextValue,
  ToggleButtonProps as AriaToggleButtonProps,
  LabelProps,
  TextProps,
  ValidationResult,
  FieldErrorProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  FieldError,
  Group,
  Label,
  Link,
  Text,
  useContextProps,
} from "react-aria-components";
import {
  createGenericComponent,
  renderGenericPropChild,
} from "~/components/generic";
import { SymbolContext } from "~/components/symbol";
import type { TypographyProps } from "~/components/typography";
import { Typography } from "~/components/typography";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonColor, ButtonVariant } from "./constants";
import { makeButtonSymbolSlots } from "./constants";
import "./index.scss";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
  isDisabled?: boolean;
  unbounded?: boolean;
}

const cls = bemHelper("button");

const buttonSymbolSlots = makeButtonSymbolSlots(cls);

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLElement>>(null);

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>("Button", AriaButton, (props, ref) => {
  let unbounded;
  [{ unbounded, ...props }, ref] = useContextProps(
    props,
    ref as never,
    ButtonContext,
  ) as [typeof props, typeof ref];
  const { surfaceProps, rootProps } = useRipple({
    disabled: props.isDisabled,
    unbounded,
  });
  const {
    variant = "text",
    color,
    compact,
    className,
    as: As,
    ref: rootRef,
    ...rest
  } = mergeProps(props, rootProps);
  return (
    <As
      {...rest}
      ref={mergeRefs(ref, rootRef as never)}
      className={cls({
        modifiers: {
          [variant]: true,
          [color ?? ""]: !!color,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderGenericPropChild(rest, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          <div
            className={cls("ripple", { unbounded: !!unbounded })}
            {...surfaceProps}
          />
          <div className={cls("content")}>{children}</div>
        </SymbolContext.Provider>
      ))}
    </As>
  );
});

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  Overwrite<LinkProps, ButtonProps>
>((props, ref) => <Button as={Link} {...props} ref={ref} />);

LinkButton.displayName = "LinkButton";

export type ToggleButtonProps = Overwrite<AriaToggleButtonProps, ButtonProps>;

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (props, ref) => <Button as={AriaToggleButton} {...props} ref={ref} />,
);

ToggleButton.displayName = "ToggleButton";

interface ButtonGroupProps
  extends Pick<ButtonProps, "color" | "variant" | "compact" | "isDisabled"> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  labelProps?: Overwrite<LabelProps, TypographyProps>;
  description?: ReactNode;
  descriptionProps?: Overwrite<TextProps, TypographyProps>;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  errorMessageProps?: Overwrite<FieldErrorProps, TypographyProps>;
  children?: ReactNode;
  className?: string;
}

export const ButtonGroup = createGenericComponent<
  typeof Group,
  ButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ButtonGroup",
  Group,
  (
    {
      className,
      as: As,
      children,

      isDisabled,
      color,
      compact,
      variant,

      orientation = "horizontal",
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
    const contextValue = useMemo<ButtonProps>(
      () => ({ color, compact, isDisabled, variant }),
      [color, compact, isDisabled, variant],
    );

    return (
      <As
        ref={ref}
        {...props}
        className={clsx("button-group", className)}
        data-orientation={orientation}
      >
        <Typography as={Label} variant="overline" {...labelProps}>
          {label}
        </Typography>
        <ButtonContext.Provider value={contextValue}>
          <div className="button-group__buttons">{children}</div>
        </ButtonContext.Provider>
        {description && (
          <Typography
            as={Text}
            slot="description"
            variant="caption"
            {...descriptionProps}
          >
            {description}
          </Typography>
        )}
        <Typography as={FieldError} variant="caption" {...errorMessageProps}>
          {errorMessage}
        </Typography>
      </As>
    );
  },
);
