import { createSelector } from "@reduxjs/toolkit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "~/db/provider";
import type { Org, OrgMember } from "~/features/orgs";
import {
  getOrgMember,
  getOrgMembers,
  getOrgs,
  selectOrgById,
  selectOrgMemberById,
} from "~/features/orgs";
import { useOptionsCreator } from "./use-options-creator";

export enum Permission {
  Unauthenticated,
  Member,
  Admin,
  Owner,
}

const getPermission = createSelector(
  (org: Org | undefined) => org,
  (_: unknown, member: OrgMember | undefined) => member,
  (org: Org | undefined, member: OrgMember | undefined) => {
    if (!org || !member) return Permission.Unauthenticated;
    if (org.owner_id === member.user_id) return Permission.Owner;
    if (member.role === "admin") return Permission.Admin;
    return Permission.Member;
  },
);

export function useUserPermissions(orgId: number, userId: string) {
  const session = useSession();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs, session?.user.id),
    select: (orgs) => selectOrgById(orgs, orgId),
  });
  const { data: member } = useQuery({
    ...useOptionsCreator(getOrgMembers, orgId),
    select: (members) => selectOrgMemberById(members, userId),
  });
  return getPermission(org, member);
}

export function useCurrentUserPermissions(orgId: number) {
  const session = useSession();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs, session?.user.id),
    select: (orgs) => selectOrgById(orgs, orgId),
  });
  const { data: member } = useQuery(
    useOptionsCreator(getOrgMember, orgId, session?.user.id),
  );
  return getPermission(org, member);
}
