import { redirect } from "@remix-run/react";
import {
  getOrg,
  getOrgMember,
  getOrgMembers,
  getOrgs,
  selectOrgById,
  selectOrgMemberById,
  selectOrgMemberId,
} from "~/features/orgs";
import type { AppLoadContext } from "~/load-context.server";
import type { Permission } from "~/util/permissions";
import { getPermission } from "~/util/permissions";

export async function ensureAuthenticated({
  supabase,
  headers,
}: Pick<AppLoadContext, "supabase" | "headers">) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error ?? !user) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/sign-in", { headers });
  }
  return user;
}

export async function ensureUserPermissions(
  context: AppLoadContext,
  orgId: number,
  userId: string,
): Promise<Permission> {
  const org = await context.queryClient.ensureQueryData(getOrg(context, orgId));
  const members = await context.queryClient.ensureQueryData(
    getOrgMembers(context, orgId),
  );
  return getPermission(
    org,
    selectOrgMemberById(
      members,
      selectOrgMemberId({
        org_id: orgId,
        user_id: userId,
      }),
    ),
  );
}

export async function ensureCurrentUserPermissions(
  context: AppLoadContext,
  orgId: number,
  orgQuery: "getOrg" | "getOrgs" = "getOrg",
): Promise<Permission> {
  const user = await ensureAuthenticated(context);
  const org =
    orgQuery === "getOrgs"
      ? selectOrgById(
          await context.queryClient.ensureQueryData(getOrgs(context, user.id)),
          orgId,
        )
      : await context.queryClient.ensureQueryData(getOrg(context, orgId));
  const member = await context.queryClient.ensureQueryData(
    getOrgMember(context, orgId, user.id),
  );
  return getPermission(org, member);
}
