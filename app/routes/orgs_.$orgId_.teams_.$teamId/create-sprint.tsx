import { mergeProps } from "@react-aria/utils";
import { createSelector } from "@reduxjs/toolkit";
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
  optional,
  pipe,
  string,
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
import type { TablesInsert } from "~/db/supabase";
import {
  addSprint,
  getSprintsForTeam,
  selectAllSprints,
} from "~/features/sprints";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";

const createSprintSchema = object({
  name: pipe(string(), nonEmpty()),
  team_id: number(),
  follows_id: optional(union([number(), null_()])),
}) satisfies BaseSchema<any, TablesInsert<"sprints">, any>;

export interface CreateSprintProps extends Omit<DialogProps, "children"> {
  teamId: number;
}

export function CreateSprint({
  teamId,
  triggerProps,
  ...props
}: CreateSprintProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: sprints = [] } = useQuery({
    ...useOptionsCreator(getSprintsForTeam, teamId),
    select: selectAllSprints,
  });
  const {
    mutate: addSprintFn,
    isError,
    isPending,
    reset,
  } = useMutation(useOptionsCreator(addSprint));
  const [errors, validateSprint, resetValidation] =
    useFormSchema(createSprintSchema);
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
            id="create-sprint-form"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const unparsed = new FormData(e.currentTarget);
              const followsId = unparsed.get("follows_id");
              const parsed = validateSprint({
                ...Object.fromEntries(unparsed.entries()),
                follows_id:
                  typeof followsId === "string" && followsId
                    ? parseInt(followsId)
                    : null,
                team_id: teamId,
              });
              if (parsed.success) {
                addSprintFn(parsed.output, {
                  onSuccess: close,
                });
              }
            }}
            validationErrors={errors?.validationErrors}
          >
            <TextField label="Name" name="name" isRequired />
            <Select
              label="Follows"
              description="Carry over actions from a previous sprint"
              name="follows_id"
              defaultSelectedKey={sprints[0]?.id ?? ""}
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
              form="create-sprint-form"
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
