import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { object, parse } from "valibot";
import { Divider } from "~/components/divider";
import { Symbol } from "~/components/symbol";
import { Tab, TabList, Tabs } from "~/components/tabs";
import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import type { Category } from "~/features/feedback";
import { Footer } from "~/features/footer";
import { NavBar } from "~/features/nav-bar";
import { getOrg } from "~/features/orgs";
import { getSprintById } from "~/features/sprints";
import { getTeam } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useParsedParams } from "~/hooks/use-parsed-params";
import { promiseOwnProperties } from "~/util/ponyfills";
import { coerceNumber } from "~/util/valibot";
import { ActionList } from "./actions-list";
import { FeedbackList } from "./feedback-list";

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

const categoryDisplay: Record<
  Category | "actions",
  {
    icon: string;
    title: string;
  }
> = {
  good: {
    icon: "reviews",
    title: "Good",
  },
  improvement: {
    icon: "chat_error",
    title: "Poor",
  },
  neutral: {
    icon: "chat_info",
    title: "Neutral",
  },
  actions: {
    icon: "task",
    title: "Actions",
  },
};

const displayEntries = Object.entries(categoryDisplay);

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
      <Tabs>
        <TabList items={displayEntries}>
          {([category, { icon, title }]) => (
            <Tab id={category} icon={<Symbol>{icon}</Symbol>}>
              {title}
            </Tab>
          )}
        </TabList>
      </Tabs>
      <Divider />
      <main
        style={{
          display: "flex",
        }}
      >
        {(["good", "improvement", "neutral"] satisfies Array<Category>).map(
          (category) => (
            <FeedbackList key={category} {...{ category }} />
          ),
        )}
        <ActionList />
      </main>
      <Footer />
    </>
  );
}
