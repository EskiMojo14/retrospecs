import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { object, parse } from "valibot";
import { ExtendedFab } from "~/components/button/fab";
import { Symbol } from "~/components/symbol";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { Layout } from "~/features/layout";
import { getOrg } from "~/features/orgs";
import { getTeamsByOrg, selectAllTeams, selectTeamIds } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useParsedParams } from "~/hooks/use-parsed-params";
import { useCurrentUserPermissions } from "~/hooks/use-user-permissions";
import { Permission } from "~/util/permissions";
import { promiseOwnProperties } from "~/util/ponyfills";
import { coerceNumber } from "~/util/valibot";
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

const paramsSchema = object({
  orgId: coerceNumber("Invalid orgId"),
});

export const loader = createHydratingLoader(
  async ({ context, context: { queryClient }, params }) => {
    const { orgId } = parse(paramsSchema, params);

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
  const { orgId } = useParsedParams(paramsSchema);
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
  const permission = useCurrentUserPermissions(orgId);
  return (
    <Layout breadcrumbs={[{ label: org.name, href: `/orgs/${orgId}` }]}>
      <TeamGrid orgId={orgId} teamIds={teamIds} />
      {permission >= Permission.Admin && (
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
      )}
    </Layout>
  );
}
