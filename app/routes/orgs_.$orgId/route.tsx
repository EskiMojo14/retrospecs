import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { NavBar } from "~/features/nav-bar";
import { getOrg } from "~/features/orgs";
import { getTeamsByOrg, selectAllTeams, selectTeamIds } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { promiseOwnProperties } from "~/util/ponyfills";
import { CreateTeam } from "./create-team";
import { TeamGrid } from "./team-grid";
import { prefetchTeamCardData } from "./team-grid.server";

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
    const { org } = await promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      orgPerms: ensureCurrentUserPermissions(context, orgId),
      teamCardData: Promise.all(
        selectAllTeams(teams).map((team) =>
          prefetchTeamCardData(team, context),
        ),
      ),
    });
    return {
      org,
      teams,
    };
  },
);

export default function Org() {
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
        <CreateTeam
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
          orgId={orgId}
        />
      </LineBackground>
    </main>
  );
}
