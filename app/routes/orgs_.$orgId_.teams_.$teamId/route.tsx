import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { Symbol } from "~/components/symbol";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { Layout } from "~/features/layout";
import { getOrg } from "~/features/orgs";
import { getSprintsForTeam, selectSprintIds } from "~/features/sprints";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useCurrentUserPermissions } from "~/hooks/use-user-permissions";
import { ensureNumber } from "~/util";
import { Permission } from "~/util/permissions";
import { promiseOwnProperties } from "~/util/ponyfills";
import { CreateSprint } from "./create-sprint";

export const meta = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  { title: `RetroSpecs - ${data?.team.name}` },
  {
    name: "description",
    content: "View and manage your team's sprints",
  },
];

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const orgId = ensureNumber(params.orgId, "Invalid orgId");

    const teamId = ensureNumber(params.teamId, "Invalid teamId");

    const { org, team, sprints } = await promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      team: queryClient.ensureQueryData(getTeam(context, teamId)),
      sprints: queryClient.ensureQueryData(getSprintsForTeam(context, teamId)),
      permissions: ensureCurrentUserPermissions(context, orgId),
    });

    return {
      org,
      team,
      sprints,
    };
  },
);

export default function Sprints() {
  const params = useParams();
  const orgId = Number(params.orgId);
  const teamId = Number(params.teamId);
  const loaderData = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrg, orgId),
    initialData: loaderData.org,
  });
  const { data: team } = useQuery({
    ...useOptionsCreator(getTeam, teamId),
    initialData: loaderData.team,
  });
  const { data: sprintIds } = useQuery({
    ...useOptionsCreator(getSprintsForTeam, teamId),
    initialData: loaderData.sprints,
    select: selectSprintIds,
  });
  const permission = useCurrentUserPermissions(orgId);

  return (
    <Layout
      breadcrumbs={[
        { label: "Organisations", href: "/" },
        {
          label: org.name,
          href: `/orgs/${orgId}`,
        },
        { label: team.name, href: `/orgs/${orgId}/teams/${teamId}` },
      ]}
    >
      {permission >= Permission.Admin && (
        <CreateSprint
          trigger={
            <ExtendedFab
              aria-label="Create sprint"
              color="green"
              placement="corner"
            >
              <Symbol slot="leading">add</Symbol>
              Create
            </ExtendedFab>
          }
          teamId={teamId}
        />
      )}
    </Layout>
  );
}
