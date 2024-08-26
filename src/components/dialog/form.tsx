import { mergeProps } from "@react-aria/utils";
import type { FormEvent, ReactNode } from "react";
import { useRef } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import { Form } from "react-aria-components";
import type { BaseSchema, InferOutput } from "valibot";
import type { ButtonProps, LoadingButtonProps } from "~/components/button";
import { Button, LoadingButton } from "~/components/button";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { useFormSchema } from "~/hooks/use-form-schema";
import type { Overwrite } from "~/util/types";
import type { DialogProps } from ".";
import { Dialog, DialogContent } from ".";

export interface FormDialogProps<T extends BaseSchema<any, any, any>>
  extends Omit<DialogProps, "children"> {
  title: ReactNode;
  schema: T;
  formId: string;
  onSubmit: (values: InferOutput<T>, close: () => void) => void;
  onCancel?: () => void;
  onReset?: () => void;
  submitButtonProps: Omit<
    Overwrite<Overwrite<AriaButtonProps, ButtonProps>, LoadingButtonProps>,
    "onPress"
  >;
  cancelButtonProps?: Omit<Overwrite<AriaButtonProps, ButtonProps>, "onPress">;
  children?: ReactNode;
}

export const FormDialog = <T extends BaseSchema<any, any, any>>({
  title,
  formId,
  schema,
  onSubmit,
  onCancel,
  onReset,
  submitButtonProps,
  cancelButtonProps,
  children,
  triggerProps,
  ...props
}: FormDialogProps<T>) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, validate, resetErrors] = useFormSchema(schema);
  return (
    <Dialog
      {...props}
      triggerProps={mergeProps(triggerProps, {
        onOpenChange(isOpen: boolean) {
          if (!isOpen) {
            formRef.current?.reset();
            resetErrors();
            onReset?.();
          }
        },
      })}
    >
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            {title}
          </Heading>
          <DialogContent
            as={Form}
            ref={formRef}
            id={formId}
            validationErrors={errors?.validationErrors}
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const result = validate(
                Object.fromEntries(new FormData(event.currentTarget)),
              );
              console.log(result);
              if (!result.success) return;
              onSubmit(result.output, close);
            }}
          >
            {children}
          </DialogContent>
          <Toolbar slot="actions">
            <Button
              variant="outlined"
              {...cancelButtonProps}
              onPress={() => {
                close();
                onCancel?.();
              }}
            >
              {cancelButtonProps?.children ?? "Cancel"}
            </Button>
            <LoadingButton
              variant="elevated"
              {...submitButtonProps}
              form={formId}
              type="submit"
            >
              {submitButtonProps?.children ?? "Submit"}
            </LoadingButton>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
};
