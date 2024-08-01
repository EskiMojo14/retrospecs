import type { MetaFunction } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { DialogTrigger, Text } from "react-aria-components";
import { AppBar } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { FloatingActionButton, LinkButton } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { LineBackground } from "~/components/line-background";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { createHydratingLoader } from "~/db/loader.server";
import { Logo } from "~/features/logo";
import { getOrgs, selectOrgIds } from "~/features/orgs";
import { CreateOrg } from "~/features/orgs/create-org";
import { OrgGrid } from "~/features/orgs/org-grid";
import { PreferencesDialog } from "~/features/user_config/dialog";
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
    await queryClient.prefetchQuery(getOrgs(context));
    return null;
  },
);

export default function Orgs() {
  const { data: orgIds = [] } = useQuery({
    ...useOptionsCreator(getOrgs),
    select: selectOrgIds,
  });

  return (
    <main>
      <LineBackground opacity={0.5}>
        <AppBar>
          <Toolbar slot="nav">
            <Logo />
            <Breadcrumbs>
              <Breadcrumb>
                <Link href="/">Organisations</Link>
              </Breadcrumb>
            </Breadcrumbs>
          </Toolbar>
          <Toolbar slot="actions">
            <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
              <Symbol>logout</Symbol>
            </IconButton>
            <PreferencesDialog />
          </Toolbar>
        </AppBar>
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
