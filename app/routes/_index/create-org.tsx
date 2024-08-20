import { mergeProps } from "@react-aria/utils";
import { useMutation } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useRef } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { nonEmpty, object, pipe, string } from "valibot";
import { Button, LoadingButton } from "~/components/button";
import type { DialogProps } from "~/components/dialog";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import type { TablesInsert } from "~/db/supabase";
import { addOrg } from "~/features/orgs";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";

const createOrgSchema = object({
  name: pipe(string(), nonEmpty()),
}) satisfies BaseSchema<any, TablesInsert<"orgs">, any>;

export function CreateOrg({
  triggerProps,
  ...props
}: Omit<DialogProps, "children">) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    mutate: addOrgFn,
    isError,
    isPending,
    reset: resetMutation,
  } = useMutation(useOptionsCreator(addOrg));
  const [errors, validateOrg, resetValidation] = useFormSchema(createOrgSchema);
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = validateOrg(Object.fromEntries(unparsedData));
    if (parsedData.success) {
      addOrgFn(parsedData.output, {
        onSuccess() {
          close();
        },
      });
    }
  };
  return (
    <Dialog
      {...props}
      triggerProps={mergeProps(triggerProps, {
        onOpenChange: (isOpen: boolean) => {
          if (!isOpen) {
            formRef.current?.reset();
            resetMutation();
            resetValidation();
          }
        },
      })}
    >
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            Create organisation
          </Heading>
          <DialogContent
            as={Form}
            ref={formRef}
            id="create-org-form"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              handleSubmit(e, close);
            }}
            validationErrors={errors?.validationErrors}
          >
            <TextField label="Name" name="name" isRequired />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              form="create-org-form"
              variant="elevated"
              isIndeterminate={isPending}
              color={isError ? "red" : undefined}
            >
              Create
            </LoadingButton>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}
