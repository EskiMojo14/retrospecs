import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, type FormEvent } from "react";
import { Form } from "react-aria-components";
import type { BaseSchema } from "valibot";
import { minLength, number, object, pipe, string } from "valibot";
import { Button } from "~/components/button";
import { ExtendedFab } from "~/components/button/fab";
import { Dialog, DialogContent } from "~/components/dialog";
import { TextField } from "~/components/input/text-field";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Heading } from "~/components/typography";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { useSession } from "~/db/provider";
import type { TablesInsert } from "~/db/supabase";
import { NavBar } from "~/features/nav-bar";
import { getOrg } from "~/features/orgs";
import { getSprintCountForTeam } from "~/features/sprints";
import {
  addTeam,
  getTeamMemberCount,
  getTeamsByOrg,
  selectTeamIds,
} from "~/features/teams";
import { TeamGrid } from "~/features/teams/team-grid";
import { useFormSchema } from "~/hooks/use-form-schema";
import { useOptionsCreator } from "~/hooks/use-options-creator";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
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
      throw new Error("Invalid orgId");
    }
    const teams = await queryClient.ensureQueryData(
      getTeamsByOrg(context, orgId),
    );
    const [org] = await Promise.all([
      queryClient.ensureQueryData(getOrg(context, orgId)),
      ensureCurrentUserPermissions(context, orgId, "getOrg"),
      ...selectTeamIds(teams).flatMap((teamId) => [
        queryClient.prefetchQuery(getTeamMemberCount(context, teamId)),
        queryClient.prefetchQuery(getSprintCountForTeam(context, teamId)),
      ]),
    ]);
    return {
      org,
      teams,
    };
  },
);

const createTeamSchema = object({
  name: pipe(string(), minLength(1)),
  org_id: number(),
  created_by: string(),
}) satisfies BaseSchema<any, TablesInsert<"teams">, any>;

export default function Org() {
  const formRef = useRef<HTMLFormElement>(null);
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
    reset,
  } = useMutation(useOptionsCreator(addTeam));
  const [errors, validateTeam, resetValidation] =
    useFormSchema(createTeamSchema);
  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar
          breadcrumbs={[
            { label: "Organisations", href: "/" },
            { label: org.name, href: `/orgs/${orgId}` },
          ]}
        />
        <TeamGrid orgId={orgId} teamIds={teamIds} />
        <Dialog
          trigger={
            <ExtendedFab
              color="green"
              aria-label="Create team"
              placement="corner"
            >
              <Symbol slot="leading">add</Symbol>
              Create
            </ExtendedFab>
          }
          triggerProps={{
            onOpenChange: (isOpen) => {
              if (!isOpen) {
                formRef.current?.reset();
                reset();
                resetValidation();
              }
            },
          }}
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
                    org_id: orgId,
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
      </LineBackground>
    </main>
  );
}
