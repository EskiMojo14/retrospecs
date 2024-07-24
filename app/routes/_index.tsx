import type { MetaFunction } from "@remix-run/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { DialogTrigger, Form, Text } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, object, pipe, safeParse, string } from "valibot";
import { AppBar } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { Button, FloatingActionButton, LinkButton } from "~/components/button";
import { Dialog, DialogContent } from "~/components/dialog";
import { IconButton } from "~/components/icon-button";
import { TextField } from "~/components/input/text-field";
import { LineBackground } from "~/components/line-background";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { useSupabase } from "~/db/provider";
import type { TablesInsert } from "~/db/supabase";
import { Logo } from "~/features/logo";
import {
  addOrgMutationOptions,
  getOrgsOptions,
  selectOrgIds,
} from "~/features/orgs";
import { OrgGrid } from "~/features/orgs/org-grid";
import { PreferencesDialog } from "~/features/user_config/dialog";
import { createHydratingLoader } from "~/store/hydrate";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Organisations" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context: { queryClient, supabase } }) => {
    await queryClient.prefetchQuery(getOrgsOptions(supabase));
    return null;
  },
);

const createOrgSchema = object({
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesInsert<"orgs">, any>;

export default function Orgs() {
  const supabase = useSupabase();
  const { data: orgIds = [] } = useQuery({
    ...getOrgsOptions(supabase),
    select: selectOrgIds,
  });
  const {
    mutate: addOrg,
    isError,
    isPending,
  } = useMutation(addOrgMutationOptions(supabase, useQueryClient()));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = safeParse(
      createOrgSchema,
      Object.fromEntries(unparsedData),
    );
    if (parsedData.success) {
      addOrg(parsedData.output);
    } else {
      console.error(parsedData.issues);
    }
  };

  return (
    <main>
      <LineBackground opacity={0.5}>
        <AppBar>
          <Toolbar slot="nav">
            <Logo />
            <Breadcrumbs>
              <Breadcrumb>
                <Link href="/">Organisations</Link>
              </Breadcrumb>
            </Breadcrumbs>
          </Toolbar>
          <Toolbar slot="actions">
            <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
              <Symbol>logout</Symbol>
            </IconButton>
            <PreferencesDialog />
          </Toolbar>
        </AppBar>
        <OrgGrid orgIds={orgIds} />
        <DialogTrigger>
          <FloatingActionButton extended color="green">
            <Symbol slot="leading">add</Symbol>
            <Text slot="label">Create</Text>
          </FloatingActionButton>
          <Dialog>
            {({ close }) => (
              <>
                <Heading variant="headline6" slot="title">
                  Create organisation
                </Heading>
                <DialogContent
                  as={Form}
                  id="create-org-form"
                  onSubmit={handleSubmit}
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
        </DialogTrigger>
      </LineBackground>
    </main>
  );
}
