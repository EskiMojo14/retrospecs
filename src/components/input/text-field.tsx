import type { ReactNode } from "react";
import type {
  TextFieldProps as AriaTextFieldProps,
  FieldErrorProps,
  TextProps,
  ValidationResult,
  LabelProps,
} from "react-aria-components";
import {
  TextField as AriaTextField,
  FieldError,
  Input,
  Label,
  Text,
  TextArea,
} from "react-aria-components";
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
}

export interface TextFieldProps
  extends Omit<AriaTextFieldProps, "children" | "className">,
    FormGroupProps {
  className?: string;
  textarea?: boolean;
}

const cls = bemHelper("text-field");

export function TextField({
  className,
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  errorMessageProps,
  textarea,
  ...props
}: TextFieldProps) {
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
      {textarea ? (
        <TextArea className={cls("textarea")} />
      ) : (
        <Input className={cls("input")} />
      )}
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
