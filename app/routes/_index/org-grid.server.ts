import { ensureCurrentUserPermissions } from "~/db/auth.server";
import type { Org } from "~/features/orgs";
import { getOrgMemberCount } from "~/features/orgs";
import { getDisplayName } from "~/features/profiles";
import { getTeamCountByOrg } from "~/features/teams";
import type { AppLoadContext } from "~/load-context.server";

export async function prefetchOrgCardData(org: Org, context: AppLoadContext) {
  const { queryClient } = context;
  return Promise.all([
    queryClient.prefetchQuery(getOrgMemberCount(context, org.id)),
    queryClient.prefetchQuery(getTeamCountByOrg(context, org.id)),
    queryClient.prefetchQuery(getDisplayName(context, org.owner_id)),
    ensureCurrentUserPermissions(context, org.id, "getOrgs"),
  ]);
}
