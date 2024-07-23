import type { MetaFunction } from "@remix-run/react";
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
import { injectOrgsApi, selectOrgIds } from "~/features/orgs";
import { OrgGrid } from "~/features/orgs/org-grid";
import { PreferencesDialog } from "~/features/preferences";
import { useEndpointInjector } from "~/hooks/use-endpoint-injector";
import { useHydratingLoaderData } from "~/hooks/use-hydrating-loader-data";
import { applyInjector } from "~/store/endpoint-injector";
import { createHydratingLoader } from "~/store/hydrate";
import { makeDisposable } from "~/util";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Organisations" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { store } }) => {
    const { api: orgsApi } = applyInjector(injectOrgsApi, context);

    using promise = makeDisposable(
      store.dispatch(orgsApi.endpoints.getOrgs.initiate()),
    );

    return { data: await promise.unwrap() };
  },
);

const createOrgSchema = object({
  name: pipe(string(), minLength(1)),
}) satisfies BaseSchema<any, TablesInsert<"orgs">, any>;

export default function Orgs() {
  const { useGetOrgsQuery, useAddOrgMutation } =
    useEndpointInjector(injectOrgsApi);
  const { data: dataFromLoader } = useHydratingLoaderData<typeof loader>();
  const { orgIds } = useGetOrgsQuery(undefined, {
    selectFromResult: ({ data = dataFromLoader }) => ({
      orgIds: selectOrgIds(data),
    }),
  });
  const [createOrg, { isLoading, isError }] = useAddOrgMutation({
    selectFromResult: ({ isLoading, isError }) => ({
      isLoading,
      isError,
    }),
  });
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = safeParse(
      createOrgSchema,
      Object.fromEntries(unparsedData),
    );
    if (parsedData.success) {
      const { error } = await createOrg(parsedData.output);
      if (error) {
        console.error(error.message);
      }
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
                    isDisabled={isLoading}
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
