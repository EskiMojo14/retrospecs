import { mergeProps } from "@react-aria/utils";
import { useMutation } from "@tanstack/react-query";
import { useRef, type FormEvent } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { nonEmpty, object, pipe, string } from "valibot";
import { Button, LoadingButton } from "~/components/button";
import type { DialogProps } from "~/components/dialog";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { useSession } from "~/db/provider";
import type { TablesInsert } from "~/db/supabase";
import { addTeam } from "~/features/teams";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { coerceNumber } from "~/util/valibot";

export interface CreateTeamProps extends Omit<DialogProps, "children"> {
  orgId: number;
}

const createTeamSchema = object({
  name: pipe(string(), nonEmpty()),
  org_id: coerceNumber,
  created_by: string(),
}) satisfies BaseSchema<any, TablesInsert<"teams">, any>;

export function CreateTeam({ orgId, triggerProps, ...props }: CreateTeamProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const session = useSession();
  const {
    mutate: addTeamFn,
    isError,
    isPending,
    reset,
  } = useMutation(useOptionsCreator(addTeam));
  const [errors, validateTeam, resetValidation] =
    useFormSchema(createTeamSchema);
  return (
    <Dialog
      {...props}
      triggerProps={mergeProps(triggerProps, {
        onOpenChange(isOpen: boolean) {
          if (!isOpen) {
            formRef.current?.reset();
            reset();
            resetValidation();
          }
        },
      })}
    >
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            Create team
          </Heading>
          <DialogContent
            as={Form}
            id="create-team-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const unparsedData = new FormData(event.currentTarget);
              const parsedData = validateTeam({
                ...Object.fromEntries(unparsedData),
                created_by: session?.user.id,
              });
              if (parsedData.success) {
                addTeamFn(parsedData.output, {
                  onSuccess: close,
                });
              }
            }}
            validationErrors={errors?.validationErrors}
          >
            <input type="hidden" name="org_id" value={orgId} />
            <TextField label="Name" name="name" isRequired />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              form="create-team-form"
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
