import { useLoaderData, useParams, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { createHydratingLoader } from "~/db/loader.server";
import { Layout } from "~/features/layout";
import { getOrg } from "~/features/orgs";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { ensureNumber } from "~/util";
import { promiseOwnProperties } from "~/util/ponyfills";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.org.name ?? "Team"} Members`,
  },
];

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const orgId = ensureNumber(params.orgId, "Invalid orgId");
    const teamId = ensureNumber(params.teamId, "Invalid teamId");

    return promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      team: queryClient.ensureQueryData(getTeam(context, teamId)),
    });
  },
);

export default function TeamMembers() {
  const params = useParams();
  const orgId = Number(params.orgId);
  const loaderData = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrg, orgId),
    initialData: loaderData.org,
  });
  const { data: team } = useQuery({
    ...useOptionsCreator(getTeam, Number(params.teamId)),
    initialData: loaderData.team,
  });
  return (
    <Layout
      breadcrumbs={[
        { label: "Organisations", href: "/" },
        { label: org.name, href: `/orgs/${org.id}` },
        { label: team.name, href: `/orgs/${org.id}/teams/${team.id}` },
        { label: "Members", href: `/orgs/${org.id}/teams/${team.id}/members` },
      ]}
    >
      hi
    </Layout>
  );
}
