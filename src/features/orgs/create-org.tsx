import { useMutation } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { Button } from "~/components/button";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import type { TablesInsert } from "~/db/supabase";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { addOrg } from ".";

const createOrgSchema = object({
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesInsert<"orgs">, any>;

export function CreateOrg() {
  const {
    mutate: addOrgFn,
    isError,
    isPending,
  } = useMutation(useOptionsCreator(addOrg));
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    close: () => void,
  ) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = safeParse(
      createOrgSchema,
      Object.fromEntries(unparsedData),
    );
    if (parsedData.success) {
      addOrgFn(parsedData.output, {
        onSuccess() {
          close();
        },
      });
    } else {
      console.error(parsedData.issues);
    }
  };
  return (
    <Dialog>
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            Create organisation
          </Heading>
          <DialogContent
            as={Form}
            id="create-org-form"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              handleSubmit(e, close);
            }}
          >
            <TextField label="Name" name="name" isRequired />
          </DialogContent>
          <Toolbar slot="actions">
            <Button onPress={close} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-org-form"
              variant="elevated"
              isDisabled={isPending}
              color={isError ? "red" : undefined}
            >
              Create
            </Button>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}
