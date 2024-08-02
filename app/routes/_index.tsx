import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { DialogTrigger, Text } from "react-aria-components";
import { FloatingActionButton } from "~/components/button";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { createHydratingLoader } from "~/db/loader.server";
import { NavBar } from "~/features/nav-bar";
import { getOrgs, selectOrgIds } from "~/features/orgs";
import { CreateOrg } from "~/features/orgs/create-org";
import { OrgGrid } from "~/features/orgs/org-grid";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { promiseOwnProperties } from "~/util";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs - Organisations" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { queryClient } }) => {
    return promiseOwnProperties({
      orgs: queryClient.ensureQueryData(getOrgs(context)),
    });
  },
);

export default function Orgs() {
  const { orgs } = useLoaderData<typeof loader>();
  const { data: orgIds = [] } = useQuery({
    ...useOptionsCreator(getOrgs),
    initialData: orgs,
    select: selectOrgIds,
  });

  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar breadcrumbs={[{ label: "Organisations", href: "/" }]} />
        <OrgGrid orgIds={orgIds} />
        <DialogTrigger>
          <FloatingActionButton
            extended
            color="green"
            aria-label="Create organisation"
          >
            <Symbol slot="leading">add</Symbol>
            <Text slot="label" aria-hidden>
              Create
            </Text>
          </FloatingActionButton>
          <CreateOrg />
        </DialogTrigger>
      </LineBackground>
    </main>
  );
}
