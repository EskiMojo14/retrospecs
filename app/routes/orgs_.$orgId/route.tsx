import {
  redirect,
  useLoaderData,
  useParams,
  type MetaFunction,
} from "@remix-run/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { FormEvent } from "react";
import { DialogTrigger, Form, Text } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, number, object, pipe, safeParse, string } from "valibot";
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
import { useSession } from "~/db/provider";
import { createHydratingLoader } from "~/db/query";
import type { TablesInsert } from "~/db/supabase";
import { Logo } from "~/features/logo";
import { getOrg } from "~/features/orgs";
import { addTeam, getTeamsByOrg, selectTeamIds } from "~/features/teams";
import { TeamGrid } from "~/features/teams/team-grid";
import { PreferencesDialog } from "~/features/user_config/dialog";
import { useOptionsCreator } from "~/hooks/use-options-creator";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `RetroSpecs - ${data?.org.name ?? "Org"}` },
  {
    name: "description",
    content: "View and manage your organization and its teams",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { queryClient }, params }) => {
    const orgId = Number(params.orgId);
    if (Number.isNaN(orgId)) {
      return redirect("/");
    }
    const org = await queryClient.ensureQueryData(getOrg(context, orgId));
    const teams = await queryClient.ensureQueryData(
      getTeamsByOrg(context, orgId),
    );
    return { org, teams };
  },
);

const createTeamSchema = object({
  name: pipe(string(), minLength(1)),
  org_id: number(),
  created_by: string(),
}) satisfies BaseSchema<any, TablesInsert<"teams">, any>;

export default function Org() {
  const session = useSession();
  const params = useParams();
  const orgId = Number(params.orgId);
  const loaderData = useLoaderData<typeof loader>();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrg, orgId),
    initialData: loaderData.org,
  });
  const { data: teamIds = [] } = useQuery({
    ...useOptionsCreator(getTeamsByOrg, orgId),
    initialData: loaderData.teams,
    select: selectTeamIds,
  });
  const {
    mutate: addTeamFn,
    isError,
    isPending,
  } = useMutation(useOptionsCreator(addTeam));
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const unparsedData = new FormData(event.currentTarget);
    const parsedData = safeParse(createTeamSchema, {
      ...Object.fromEntries(unparsedData),
      org_id: orgId,
      created_by: session?.user.id,
    });
    if (parsedData.success) {
      addTeamFn(parsedData.output);
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
              <Breadcrumb>{org.name}</Breadcrumb>
            </Breadcrumbs>
          </Toolbar>
          <Toolbar slot="actions">
            <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
              <Symbol>logout</Symbol>
            </IconButton>
            <PreferencesDialog />
          </Toolbar>
        </AppBar>
        <TeamGrid orgId={orgId} teamIds={teamIds} />
        <DialogTrigger>
          <FloatingActionButton extended color="green">
            <Symbol slot="leading">add</Symbol>
            <Text slot="label">Create</Text>
          </FloatingActionButton>
          <Dialog>
            {({ close }) => (
              <>
                <Heading variant="headline6" slot="title">
                  Create team
                </Heading>
                <DialogContent
                  as={Form}
                  id="create-team-form"
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
                    form="create-team-form"
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
