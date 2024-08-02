import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { AppBar } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { LinkButton } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { LineBackground } from "~/components/line-background";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { createHydratingLoader } from "~/db/loader.server";
import { Logo } from "~/features/logo";
import { getOrgMembers, getOrgName, selectOrgMemberIds } from "~/features/orgs";
import { MemberList } from "~/features/orgs/member-list";
import { PreferencesDialog } from "~/features/user_config/dialog";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { promiseOwnProperties } from "~/util";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.orgName ?? "Org"} Members`,
  },
];

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const orgId = Number(params.orgId);
    if (Number.isNaN(orgId)) {
      throw new Error("Invalid orgId");
    }

    return promiseOwnProperties({
      orgName: queryClient.ensureQueryData(getOrgName(context, orgId)),
      orgMembers: queryClient.ensureQueryData(getOrgMembers(context, orgId)),
    });
  },
);

export default function OrgMembers() {
  const params = useParams();
  const orgId = Number(params.orgId);
  const { orgName, orgMembers } = useLoaderData<typeof loader>();
  const { data: memberIds } = useQuery({
    ...useOptionsCreator(getOrgMembers, orgId),
    initialData: orgMembers,
    select: (members) => selectOrgMemberIds(members),
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
              <Breadcrumb>
                <Link href={`/orgs/${orgId}`}>{orgName}</Link>
              </Breadcrumb>
              <Breadcrumb>Members</Breadcrumb>
            </Breadcrumbs>
          </Toolbar>
          <Toolbar slot="actions">
            <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
              <Symbol>logout</Symbol>
            </IconButton>
            <PreferencesDialog />
          </Toolbar>
        </AppBar>
        <MemberList orgId={orgId} memberIds={memberIds} />
      </LineBackground>
    </main>
  );
}
