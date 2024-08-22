import type { MetaFunction } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useQuery } from "@tanstack/react-query";
import { object, parse } from "valibot";
import { ExtendedFab } from "~/components/button/fab";
import { Grid } from "~/components/grid";
import { Symbol } from "~/components/symbol";
import {
  ensureCurrentUserPermissions,
  ensureUserPermissions,
} from "~/db/auth.server";
import { createHydratingLoader } from "~/db/loader.server";
import { getInvitesByOrgId } from "~/features/invites";
import { Layout } from "~/features/layout";
import { getOrg, getOrgMembers, selectOrgMemberIds } from "~/features/orgs";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useParsedParams } from "~/hooks/use-parsed-params";
import { useCurrentUserPermissions } from "~/hooks/use-user-permissions";
import { Permission } from "~/util/permissions";
import { promiseOwnProperties } from "~/util/ponyfills";
import { coerceNumber } from "~/util/valibot";
import { CreateInvite } from "./create-invite";
import { MemberList } from "./member-list";
import { PendingInvites } from "./pending";

export const meta: MetaFunction<any> = ({
  data,
}: {
  data: Awaited<ReturnType<typeof loader>> | undefined;
}) => [
  {
    title: `Retrospecs - ${data?.org.name ?? "Org"} Members`,
  },
];

const paramsSchema = object({
  orgId: coerceNumber("Invalid orgId"),
});

export const loader = createHydratingLoader(
  async ({ params, context, context: { queryClient } }) => {
    const { orgId } = parse(paramsSchema, params);

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
  const { orgId } = useParsedParams(paramsSchema);
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
    <Layout
      breadcrumbs={[
        { label: loaderData.org.name, href: `/orgs/${orgId}` },
        { label: "Members", href: `/orgs/${orgId}/members` },
      ]}
    >
      <Grid>
        <MemberList orgId={orgId} memberIds={memberIds} />
        {permissions >= Permission.Admin && <PendingInvites orgId={orgId} />}
      </Grid>
      {permissions >= Permission.Admin && (
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
      )}
    </Layout>
  );
}
