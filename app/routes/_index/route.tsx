import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { DialogTrigger } from "react-aria-components";
import { ExtendedFab } from "~/components/button/fab";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { ensureAuthenticated } from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { useSession } from "~/db/provider";
import { NavBar } from "~/features/nav-bar";
import { getOrgs, selectOrgIds } from "~/features/orgs";
import { CreateOrg } from "~/features/orgs/create-org";
import { OrgGrid } from "~/features/orgs/org-grid";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { promiseOwnProperties } from "~/util";
import styles from "./route.module.scss";

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
    return promiseOwnProperties({
      orgs: queryClient.ensureQueryData(getOrgs(context, user.id)),
    });
  },
);

export default function Orgs() {
  const session = useSession();
  const { orgs } = useLoaderData<typeof loader>();
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
        <DialogTrigger>
          <ExtendedFab
            color="green"
            aria-label="Create organisation"
            className={styles.fab}
          >
            <Symbol slot="leading">add</Symbol>
            Create
          </ExtendedFab>
          <CreateOrg />
        </DialogTrigger>
      </LineBackground>
    </main>
  );
}
