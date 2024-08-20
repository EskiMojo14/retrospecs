import { ensureCurrentUserPermissions } from "~/db/auth.server";
import { getDisplayName } from "~/features/profiles";
import { getSprintCountForTeam } from "~/features/sprints";
import type { Team } from "~/features/teams";
import { getTeamMemberCount } from "~/features/teams";
import type { AppLoadContext } from "~/load-context.server";

export function prefetchTeamCardData(team: Team, context: AppLoadContext) {
  const { queryClient } = context;
  return Promise.all([
    queryClient.prefetchQuery(getTeamMemberCount(context, team.id)),
    queryClient.prefetchQuery(getSprintCountForTeam(context, team.id)),
    queryClient.prefetchQuery(getDisplayName(context, team.created_by)),
    ensureCurrentUserPermissions(context, team.org_id, "getOrgs"),
  ]);
}
