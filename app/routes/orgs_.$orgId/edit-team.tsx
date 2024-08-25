import { mergeProps } from "@react-aria/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import type { TablesUpdate } from "~/db/supabase";
import { getTeamsByOrg, selectTeamById, updateTeam } from "~/features/teams";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { coerceNumber } from "~/util/valibot";

export interface EditTeamProps extends Omit<DialogProps, "children"> {
  orgId: number;
  teamId: number;
}

const editTeamSchema = object({
  name: pipe(string(), nonEmpty()),
  org_id: coerceNumber(),
  id: coerceNumber(),
}) satisfies BaseSchema<any, TablesUpdate<"teams">, any>;

export function EditTeam({
  orgId,
  teamId,
  triggerProps,
  ...props
}: EditTeamProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: team } = useQuery({
    ...useOptionsCreator(getTeamsByOrg, orgId),
    select: (teams) => selectTeamById(teams, teamId),
  });
  const {
    mutate: addTeamFn,
    isError,
    isPending,
    reset,
  } = useMutation(useOptionsCreator(updateTeam));
  const [errors, validateTeam, resetValidation] = useFormSchema(editTeamSchema);
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
            Edit team
          </Heading>
          <DialogContent
            as={Form}
            id="edit-team-form"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const unparsedData = new FormData(event.currentTarget);
              const parsedData = validateTeam(Object.fromEntries(unparsedData));
              if (parsedData.success) {
                addTeamFn(parsedData.output, {
                  onSuccess: close,
                });
              }
            }}
            validationErrors={errors?.validationErrors}
          >
            <input type="hidden" name="org_id" value={orgId} />
            <input type="hidden" name="id" value={teamId} />
            <TextField
              label="Name"
              name="name"
              defaultValue={team?.name}
              isRequired
            />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              form="edit-team-form"
              variant="elevated"
              isIndeterminate={isPending}
              color={isError ? "red" : undefined}
            >
              Update
            </LoadingButton>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}
