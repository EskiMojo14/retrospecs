import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, number, object, pipe, safeParse, string } from "valibot";
import { Button } from "~/components/button";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import type { TablesUpdate } from "~/db/supabase";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { getOrgs, selectOrgById, updateOrg } from ".";

export interface EditOrgProps {
  orgId: number;
}

const editSchema = object({
  id: number(),
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesUpdate<"orgs">, any>;

export function EditOrg({ orgId }: EditOrgProps) {
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs),
    select: (orgs) => selectOrgById(orgs, orgId),
  });
  const {
    mutate: editOrg,
    isError,
    isPending,
  } = useMutation(useOptionsCreator(updateOrg));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = safeParse(editSchema, {
      ...Object.fromEntries(unparsedData),
      id: orgId,
    });
    if (parsedData.success) {
      editOrg(parsedData.output);
    } else {
      console.error(parsedData.issues);
    }
  };
  if (!org) return null;
  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            Edit organisation
          </Heading>
          <DialogContent as={Form} id="edit-org-form" onSubmit={handleSubmit}>
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
