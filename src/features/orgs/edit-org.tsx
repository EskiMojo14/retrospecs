import { mergeProps } from "@react-aria/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useRef } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, number, object, pipe, string } from "valibot";
import { Button } from "~/components/button";
import type { DialogProps } from "~/components/dialog";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { useSession } from "~/db/provider";
import type { TablesUpdate } from "~/db/supabase";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { getOrgs, selectOrgById, updateOrg } from ".";

export interface EditOrgProps extends Omit<DialogProps, "children"> {
  orgId: number;
}

const editSchema = object({
  id: number(),
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesUpdate<"orgs">, any>;

export function EditOrg({ triggerProps, orgId, ...props }: EditOrgProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const session = useSession();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs, session?.user.id),
    select: (orgs) => selectOrgById(orgs, orgId),
  });
  const {
    mutate: editOrg,
    isError,
    isPending,
    reset: resetMutation,
  } = useMutation(useOptionsCreator(updateOrg));
  const [errors, validateOrg, resetValidation] = useFormSchema(editSchema);
  if (!org) return null;
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
            Edit organisation
          </Heading>
          <DialogContent
            as={Form}
            ref={formRef}
            id="edit-org-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const parsedData = validateOrg({
                ...Object.fromEntries(new FormData(event.currentTarget)),
                id: orgId,
              });
              if (parsedData.success) {
                editOrg(parsedData.output, {
                  onSuccess() {
                    close();
                  },
                });
              }
            }}
            validationErrors={errors?.validationErrors}
          >
            <TextField
              label="Name"
              name="name"
              defaultValue={org.name}
              isRequired
            />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-org-form"
              variant="elevated"
              isDisabled={isPending}
              color={isError ? "red" : undefined}
            >
              Save
            </Button>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}
