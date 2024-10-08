import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { Symbol } from "~/components/symbol";
import { ensureAuthenticated } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { useSession } from "~/db/provider";
import { Layout } from "~/features/layout";
import { getOrgs, selectAllOrgs, selectOrgIds } from "~/features/orgs";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { CreateOrg } from "./create-org";
import { OrgGrid } from "./org-grid";
import { prefetchOrgCardData } from "./org-grid.server";

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
      selectAllOrgs(orgs).map((org) => prefetchOrgCardData(org, context)),
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
    <Layout>
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
    </Layout>
  );
}
