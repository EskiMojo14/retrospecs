import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import {
  ensureAuthenticated,
  ensureCurrentUserPermissions,
} from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { useSession } from "~/db/provider";
import { NavBar } from "~/features/nav-bar";
import { getOrgMemberCount, getOrgs, selectOrgIds } from "~/features/orgs";
import { CreateOrg } from "~/features/orgs/create-org";
import { OrgGrid } from "~/features/orgs/org-grid";
import { getTeamCountByOrg } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Organisations" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { queryClient } }) => {
    const user = await ensureAuthenticated(context);
    const orgs = await queryClient.ensureQueryData(getOrgs(context, user.id));
    await Promise.all(
      selectOrgIds(orgs).flatMap((orgId) => [
        queryClient.prefetchQuery(getOrgMemberCount(context, orgId)),
        queryClient.prefetchQuery(getTeamCountByOrg(context, orgId)),
        ensureCurrentUserPermissions(context, orgId, "getOrgs"),
      ]),
    );
    return {
      orgs,
    };
  },
);

export default function Orgs() {
  const session = useSession();
  const { orgs } = useLoaderData<Awaited<ReturnType<typeof loader>>>();
  const { data: orgIds = [] } = useQuery({
    ...useOptionsCreator(getOrgs, session?.user.id),
    initialData: orgs,
    select: selectOrgIds,
  });

  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar breadcrumbs={[{ label: "Organisations", href: "/" }]} />
        <OrgGrid orgIds={orgIds} />
        <CreateOrg
          trigger={
            <ExtendedFab
              color="green"
              aria-label="Create organisation"
              placement="corner"
            >
              <Symbol slot="leading">add</Symbol>
              Create
            </ExtendedFab>
          }
        />
      </LineBackground>
    </main>
  );
}
