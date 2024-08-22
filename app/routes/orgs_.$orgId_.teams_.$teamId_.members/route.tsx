import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { object, parse } from "valibot";
import { createHydratingLoader } from "~/db/loader.server";
import { Layout } from "~/features/layout";
import { getOrg } from "~/features/orgs";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useParsedParams } from "~/hooks/use-parsed-params";
import { promiseOwnProperties } from "~/util/ponyfills";
import { coerceNumber } from "~/util/valibot";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.org.name ?? "Team"} Members`,
  },
];

const paramsSchema = object({
  orgId: coerceNumber("Invalid orgId"),
  teamId: coerceNumber("Invalid teamId"),
});

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const { orgId, teamId } = parse(paramsSchema, params);

    return promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      team: queryClient.ensureQueryData(getTeam(context, teamId)),
    });
  },
);

export default function TeamMembers() {
  const { orgId, teamId } = useParsedParams(paramsSchema);
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
    <Layout
      breadcrumbs={[
        { label: "Organisations", href: "/" },
        { label: org.name, href: `/orgs/${orgId}` },
        { label: team.name, href: `/orgs/${orgId}/teams/${teamId}` },
        { label: "Members", href: `/orgs/${orgId}/teams/${teamId}/members` },
      ]}
    >
      hi
    </Layout>
  );
}
