import { mergeProps } from "@react-aria/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { useRef } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import {
  nonEmpty,
  null_,
  number,
  object,
  pipe,
  string,
  transform,
  union,
} from "valibot";
import { Button, LoadingButton } from "~/components/button";
import type { DialogProps } from "~/components/dialog";
import { Dialog, DialogContent } from "~/components/dialog";
import { Divider } from "~/components/divider";
import { IdFragment } from "~/components/fragment";
import { Select, SelectItem } from "~/components/input/select";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import type { TablesUpdate } from "~/db/supabase";
import {
  getPreviousTeamSprints,
  getSprintsForTeam,
  selectAllSprints,
  selectSprintById,
  updateSprint,
} from "~/features/sprints";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { coerceNumber } from "~/util/valibot";

const editSprintSchema = object({
  name: pipe(string(), nonEmpty()),
  team_id: coerceNumber,
  id: coerceNumber,
  follows_id: pipe(
    string(),
    // special case - empty string means no follows
    transform((v) => (v === "" ? null : parseInt(v))),
    union([number(), null_()]),
  ),
}) satisfies BaseSchema<any, TablesUpdate<"sprints">, any>;

export interface EditSprintProps extends Omit<DialogProps, "children"> {
  teamId: number;
  sprintId: number;
}

export function EditSprint({
  teamId,
  sprintId,
  triggerProps,
  ...props
}: EditSprintProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: sprint } = useQuery({
    ...useOptionsCreator(getSprintsForTeam, teamId),
    select: (sprints) => selectSprintById(sprints, sprintId),
  });
  const { data: sprints = [] } = useQuery({
    ...useOptionsCreator(getPreviousTeamSprints, teamId, sprint),
    select: selectAllSprints,
  });
  const {
    mutate: updateSprintFn,
    isError,
    isPending,
    reset,
  } = useMutation(useOptionsCreator(updateSprint));
  const [errors, validateSprint, resetValidation] =
    useFormSchema(editSprintSchema);
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
            Create sprint
          </Heading>
          <DialogContent
            as={Form}
            ref={formRef}
            id="edit-sprint-form"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const unparsed = new FormData(e.currentTarget);
              const parsed = validateSprint(
                Object.fromEntries(unparsed.entries()),
              );
              if (parsed.success) {
                updateSprintFn(parsed.output, {
                  onSuccess: close,
                });
              }
            }}
            validationErrors={errors?.validationErrors}
          >
            <input type="hidden" name="team_id" value={teamId} />
            <input type="hidden" name="id" value={sprintId} />
            <TextField
              label="Name"
              name="name"
              defaultValue={sprint?.name}
              isRequired
            />
            <Select
              label="Follows"
              description="Carry over actions from a previous sprint"
              name="follows_id"
              defaultSelectedKey={sprint?.follows_id ?? ""}
              items={[{ name: "None", id: "" }, ...sprints]}
            >
              {(item) => {
                if (item.id === "") {
                  return (
                    <IdFragment id={item.id}>
                      <SelectItem id={item.id} textValue={item.name}>
                        {item.name}
                      </SelectItem>
                      <Divider />
                    </IdFragment>
                  );
                }
                return (
                  <SelectItem id={item.id} textValue={item.name}>
                    {item.name}
                  </SelectItem>
                );
              }}
            </Select>
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              form="edit-sprint-form"
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
