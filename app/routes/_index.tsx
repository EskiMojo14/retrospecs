import type { MetaFunction } from "@remix-run/react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import type { TablesInsert } from "~/db/supabase";
import { Logo } from "~/features/logo";
import { orgsApi, selectOrgIds } from "~/features/orgs";
import { OrgGrid } from "~/features/orgs/org-grid";
import { PreferencesDialog } from "~/features/user_config/dialog";
import { useOptionsCreator } from "~/hooks/use-query-options";
import { createHydratingLoader } from "~/store/hydrate";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Organisations" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { queryClient } }) => {
    await queryClient.prefetchQuery(orgsApi.getOrgs(context));
    return null;
  },
);

const createOrgSchema = object({
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesInsert<"orgs">, any>;

export default function Orgs() {
  const { data: orgIds = [] } = useQuery({
    ...useOptionsCreator(orgsApi.getOrgs),
    select: selectOrgIds,
  });
  const {
    mutate: addOrg,
    isError,
    isPending,
  } = useMutation(useOptionsCreator(orgsApi.addOrg));
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
