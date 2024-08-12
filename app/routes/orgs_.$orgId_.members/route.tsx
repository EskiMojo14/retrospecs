import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useParams } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { ExtendedFab } from "~/components/button/fab";
import { Grid } from "~/components/grid";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import {
  ensureCurrentUserPermissions,
  ensureUserPermissions,
} from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { getInvitesByOrgId } from "~/features/invites";
import { CreateInvite } from "~/features/invites/create-invite";
import { PendingInvites } from "~/features/invites/pending";
import { NavBar } from "~/features/nav-bar";
import { getOrg, getOrgMembers, selectOrgMemberIds } from "~/features/orgs";
import { MemberList } from "~/features/orgs/member-list";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useCurrentUserPermissions } from "~/hooks/use-user-permissions";
import { Permission } from "~/util/permissions";
import { promiseOwnProperties } from "~/util/ponyfills";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.org.name ?? "Org"} Members`,
  },
];

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const orgId = Number(params.orgId);
    if (Number.isNaN(orgId)) {
      throw new Error("Invalid orgId");
    }

    const orgMembers = await queryClient.ensureQueryData(
      getOrgMembers(context, orgId),
    );

    const currentUserPermissions = await ensureCurrentUserPermissions(
      context,
      orgId,
    );

    return promiseOwnProperties({
      org: queryClient.ensureQueryData(getOrg(context, orgId)),
      orgMembers,
      currentUserPermissions,
      memberPermissions: Promise.all(
        selectOrgMemberIds(orgMembers).map((memberId) =>
          ensureUserPermissions(context, orgId, memberId),
        ),
      ),
      invites:
        currentUserPermissions >= Permission.Admin
          ? queryClient.ensureQueryData(getInvitesByOrgId(context, orgId))
          : undefined,
    });
  },
);

export default function OrgMembers() {
  const params = useParams();
  const orgId = Number(params.orgId);
  const loaderData = useLoaderData<typeof loader>();
  const { data: memberIds } = useQuery({
    ...useOptionsCreator(getOrgMembers, orgId),
    initialData: loaderData.orgMembers,
    select: (members) => selectOrgMemberIds(members),
  });
  const permissions = Math.max(
    loaderData.currentUserPermissions,
    useCurrentUserPermissions(orgId),
  ) as Permission;
  return (
    <main>
      <LineBackground opacity={0.5}>
        <NavBar
          breadcrumbs={[
            { label: "Organisations", href: "/" },
            { label: loaderData.org.name, href: `/orgs/${orgId}` },
            { label: "Members", href: `/orgs/${orgId}/members` },
          ]}
        />
        <Grid>
          <MemberList orgId={orgId} memberIds={memberIds} />
          {permissions >= Permission.Admin && <PendingInvites orgId={orgId} />}
        </Grid>
        <CreateInvite
          orgId={orgId}
          trigger={
            <ExtendedFab
              placement="corner"
              color="green"
              aria-label="Invite Member"
            >
              <Symbol slot="leading">group_add</Symbol>
              Invite
            </ExtendedFab>
          }
        />
      </LineBackground>
    </main>
  );
}
