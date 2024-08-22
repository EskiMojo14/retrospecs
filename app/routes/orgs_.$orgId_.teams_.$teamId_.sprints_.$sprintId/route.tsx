import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { object, parse } from "valibot";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { Footer } from "~/features/footer";
import { NavBar } from "~/features/nav-bar";
import { getOrg } from "~/features/orgs";
import { getSprintById } from "~/features/sprints";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useParsedParams } from "~/hooks/use-parsed-params";
import { promiseOwnProperties } from "~/util/ponyfills";
import { coerceNumber } from "~/util/valibot";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Sprint" },
  {
    name: "description",
    content: "View a sprint",
  },
];

const paramsSchema = object({
  orgId: coerceNumber("Invalid orgId"),
  teamId: coerceNumber("Invalid teamId"),
  sprintId: coerceNumber("Invalid sprintId"),
});

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const { orgId, teamId, sprintId } = parse(paramsSchema, params);
    const { org, team, sprint } = await promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      team: queryClient.ensureQueryData(getTeam(context, teamId)),
      sprint: queryClient.ensureQueryData(getSprintById(context, sprintId)),
      permissions: ensureCurrentUserPermissions(context, orgId),
    });
    return { org, team, sprint };
  },
);

export default function Sprints() {
  const { orgId, teamId, sprintId } = useParsedParams(paramsSchema);
  const loaderData = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrg, orgId),
    initialData: loaderData.org,
  });
  const { data: team } = useQuery({
    ...useOptionsCreator(getTeam, teamId),
    initialData: loaderData.team,
  });
  const { data: sprint } = useQuery({
    ...useOptionsCreator(getSprintById, sprintId),
    initialData: loaderData.sprint,
  });
  return (
    <>
      <NavBar
        breadcrumbs={[
          { label: org.name, href: `/orgs/${org.id}` },
          { label: team.name, href: `/orgs/${org.id}/teams/${team.id}` },
          {
            label: sprint.name,
            href: `/orgs/${org.id}/teams/${team.id}/sprints/${sprint.id}`,
          },
        ]}
      />
      <main></main>
      <Footer />
    </>
  );
}
