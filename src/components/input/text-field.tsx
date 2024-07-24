import type { ContextType, ReactNode } from "react";
import { useMemo, useRef } from "react";
import type {
  TextFieldProps as AriaTextFieldProps,
  FieldErrorProps,
  TextProps,
  ValidationResult,
  LabelProps,
  InputProps,
  PressEvent,
} from "react-aria-components";
import {
  TextField as AriaTextField,
  FieldError,
  Input,
  Label,
  Text,
  TextArea,
} from "react-aria-components";
import { ButtonContext } from "~/components/button";
import { Provider } from "~/components/provider";
import { SymbolContext } from "~/components/symbol";
import type { TypographyProps } from "~/components/typography";
import { Typography } from "~/components/typography";
import { bemHelper } from "~/util";
import type { Overwrite } from "~/util/types";
import "./index.scss";

export interface FormGroupProps {
  label?: ReactNode;
  labelProps?: Overwrite<LabelProps, Partial<TypographyProps>>;
  description?: ReactNode;
  descriptionProps?: Overwrite<TextProps, Partial<TypographyProps>>;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  errorMessageProps?: Overwrite<FieldErrorProps, Partial<TypographyProps>>;
  icon?: ReactNode;
  action?: ReactNode;
  onAction?: (event: PressEvent) => void;
}

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, "children" | "className">,
    FormGroupProps {
  className?: string;
  textarea?: boolean;
}

const cls = bemHelper("text-field");

const symbolContextValue: ContextType<typeof SymbolContext> = {
  className: cls("icon"),
};

export function TextField({
  className,
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  errorMessageProps,
  textarea,
  icon,
  action,
  onAction,
  ...props
}: TextFieldProps) {
  const containerRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const inputEventProps = useMemo(() => {
    const setContainerState = (state: string, value: boolean) => () => {
      if (!containerRef.current) return;
      if (value) {
        containerRef.current.dataset[state] = String(value);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete containerRef.current.dataset[state];
      }
    };
    return {
      onHoverStart: setContainerState("hovered", true),
      onHoverEnd: setContainerState("hovered", false),
      onFocus: setContainerState("focused", true),
      onBlur: setContainerState("focused", false),
    } satisfies InputProps;
  }, []);
  const buttonContextValue = useMemo<ContextType<typeof ButtonContext>>(
    () => ({
      slots: {
        action: {
          compact: true,
          className: cls("action"),
          onPress: onAction,
        },
      },
    }),
    [onAction],
  );
  return (
    <AriaTextField
      {...props}
      className={cls({
        extra: className,
      })}
    >
      <Typography
        as={Label}
        variant="subtitle2"
        {...labelProps}
        className={cls({
          element: "label",
          extra: labelProps?.className,
        })}
      >
        {label}
      </Typography>
      <label ref={containerRef} className={cls("input-container")}>
        <Provider
          values={[
            [SymbolContext.Provider, symbolContextValue],
            [ButtonContext.Provider, buttonContextValue],
          ]}
        >
          {icon}
          {textarea ? (
            <TextArea
              ref={inputRef}
              className={cls("textarea")}
              {...inputEventProps}
            />
          ) : (
            <Input
              ref={inputRef}
              className={cls("input")}
              {...inputEventProps}
            />
          )}
          {action}
        </Provider>
      </label>
      {description && (
        <Typography
          as={Text}
          variant="caption"
          slot="description"
          {...descriptionProps}
          className={cls({
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
        className={cls({
          element: "error-message",
          extra: errorMessageProps?.className,
        })}
      >
        {errorMessage}
      </Typography>
    </AriaTextField>
  );
}
