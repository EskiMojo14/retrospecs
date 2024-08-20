import { mergeProps } from "@react-aria/utils";
import { useMutation } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useRef } from "react";
import { Form } from "react-aria-components";
import { nonEmpty, object, pipe, string } from "valibot";
import { Button, LoadingButton } from "~/components/button";
import type { DialogProps } from "~/components/dialog";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { addInvite } from "~/features/invites";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";

export interface CreateInviteProps extends Omit<DialogProps, "children"> {
  orgId: number;
}

const addMemberFormSchema = object({
  email: pipe(string(), nonEmpty("Please enter your email.")),
});

export function CreateInvite({
  orgId,
  triggerProps,
  ...props
}: CreateInviteProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const {
    mutate: createInvite,
    isPending,
    reset: resetMutation,
  } = useMutation(useOptionsCreator(addInvite));
  const [errors, validateInvite, resetValidation] =
    useFormSchema(addMemberFormSchema);
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
            Invite member
          </Heading>
          <DialogContent
            as={Form}
            ref={formRef}
            id="invite-member-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const parsedData = validateInvite(
                Object.fromEntries(new FormData(event.currentTarget)),
              );
              if (!parsedData.success) {
                return;
              }
              const { email } = parsedData.output;
              createInvite(
                { email, org_id: orgId },
                {
                  onSuccess() {
                    close();
                  },
                },
              );
            }}
            validationErrors={errors?.validationErrors}
          >
            <TextField label="Email" name="email" type="email" isRequired />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              form="invite-member-form"
              type="submit"
              color="green"
              variant="elevated"
              isIndeterminate={isPending}
            >
              Invite
            </LoadingButton>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}