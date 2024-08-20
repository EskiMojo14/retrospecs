import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { NavBar } from "~/features/nav-bar";
import { getOrg } from "~/features/orgs";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";

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
    const orgId = Number(params.orgId);
    if (Number.isNaN(orgId)) {
      throw new Error("Invalid orgId");
    }
    const teamId = Number(params.teamId);
    if (Number.isNaN(teamId)) {
      throw new Error("Invalid teamId");
    }
    const org = await queryClient.ensureQueryData(getOrg(context, orgId));
    const team = await queryClient.ensureQueryData(getTeam(context, teamId));
    await ensureCurrentUserPermissions(context, orgId);
    return {
      org,
      team,
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

  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar
          breadcrumbs={[
            { label: "Organisations", href: "/" },
            {
              label: org.name,
              href: `/orgs/${orgId}`,
            },
            { label: team.name, href: `/orgs/${orgId}/teams/${teamId}` },
          ]}
        />
        <ExtendedFab
          aria-label="Create sprint"
          color="green"
          placement="corner"
        >
          <Symbol slot="leading">add</Symbol>
          Create
        </ExtendedFab>
      </LineBackground>
    </main>
  );
}
