import { createEntityAdapter } from "@reduxjs/toolkit";
import { skipToken } from "@tanstack/react-query";
import type { Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import {
  compoundKey,
  supabaseFn,
  supabaseQueryOptions,
  supabaseMutationOptions,
} from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Org = Tables<"orgs">;
export type OrgMember = Tables<"org_members">;

export const orgAdapter = createEntityAdapter<Org>();

export const {
  selectAll: selectAllOrgs,
  selectById: selectOrgById,
  selectIds: selectOrgIds,
  selectEntities: selectOrgEntities,
  selectTotal: selectTotalOrgs,
} = orgAdapter.getSelectors();

const selectOrgMemberId = compoundKey<OrgMember>()("org_id", "user_id");

export const orgMemberAdapter = createEntityAdapter<OrgMember, string>({
  selectId: selectOrgMemberId,
});

export const {
  selectAll: selectAllOrgMembers,
  selectById: selectOrgMemberById,
  selectIds: selectOrgMemberIds,
  selectEntities: selectOrgMemberEntities,
  selectTotal: selectTotalOrgMembers,
} = orgMemberAdapter.getSelectors();

export const getOrgs = supabaseQueryOptions(({ supabase }) => ({
  queryKey: ["orgs"],
  queryFn: supabaseFn(
    () => supabase.from("orgs").select(),
    (orgs) => orgAdapter.getInitialState(undefined, orgs),
  ),
}));

export const getOrg = supabaseQueryOptions(({ supabase }, id: Org["id"]) => ({
  queryKey: ["orgs", id],
  queryFn: supabaseFn(() =>
    supabase.from("orgs").select().eq("id", id).single(),
  ),
}));

export const addOrg = supabaseMutationOptions(({ supabase, queryClient }) => ({
  mutationFn: supabaseFn((org: TablesInsert<"orgs">) =>
    supabase.from("orgs").insert(org),
  ),
  async onSuccess() {
    await queryClient.invalidateQueries({
      queryKey: ["orgs"],
    });
  },
}));

export const updateOrg = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((org: PickRequired<TablesUpdate<"orgs">, "id">) =>
      supabase.from("orgs").update(org).eq("id", org.id),
    ),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgs"],
      });
    },
  }),
);

export const deleteOrg = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((id: Org["id"]) =>
      supabase.from("orgs").delete().eq("id", id),
    ),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgs"],
      });
    },
  }),
);

export const getOrgMemberCount = supabaseQueryOptions(
  ({ supabase }, orgId: Org["id"]) => ({
    queryKey: ["orgMembersCount", orgId],
    queryFn: supabaseFn(
      () =>
        supabase
          .from("org_members")
          .select("*", { count: "exact", head: true })
          .eq("org_id", orgId),
      (_res, { count }) => count ?? 0,
    ),
  }),
);

export const getOrgMember = supabaseQueryOptions(
  (
    { supabase },
    orgId: Org["id"],
    userId: OrgMember["user_id"] | undefined,
  ) => ({
    queryKey: ["orgMembers", orgId, userId],
    queryFn: userId
      ? supabaseFn(() =>
          supabase
            .from("org_members")
            .select()
            .eq("org_id", orgId)
            .eq("user_id", userId)
            .single(),
        )
      : skipToken,
  }),
);

export const getOrgMembers = supabaseQueryOptions(
  ({ supabase }, orgId: Org["id"]) => ({
    queryKey: ["orgMembers", orgId],
    queryFn: supabaseFn(
      () => supabase.from("org_members").select().eq("org_id", orgId),
      (members) => orgMemberAdapter.getInitialState(undefined, members),
    ),
  }),
);

export const addOrgMember = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((member: TablesInsert<"org_members">) =>
      supabase.from("org_members").insert(member),
    ),
    async onSuccess(_: null, { org_id }: TablesInsert<"org_members">) {
      await queryClient.invalidateQueries({
        queryKey: ["orgMembers", org_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orgMembersCount", org_id],
      });
    },
  }),
);

export const updateOrgMember = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn(
      ({
        org_id,
        user_id,
        ...member
      }: PickRequired<TablesUpdate<"org_members">, "org_id" | "user_id">) =>
        supabase
          .from("org_members")
          .update(member)
          .eq("org_id", org_id)
          .eq("user_id", user_id),
    ),
    async onSuccess(
      _: null,
      {
        org_id,
      }: PickRequired<TablesUpdate<"org_members">, "org_id" | "user_id">,
    ) {
      await queryClient.invalidateQueries({
        queryKey: ["orgMembers", org_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orgMembersCount", org_id],
      });
    },
  }),
);

export const deleteOrgMember = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((member: Pick<OrgMember, "org_id" | "user_id">) =>
      supabase
        .from("org_members")
        .delete()
        .eq("org_id", member.org_id)
        .eq("user_id", member.user_id),
    ),
    async onSuccess(
      _: null,
      { org_id }: Pick<OrgMember, "org_id" | "user_id">,
    ) {
      await queryClient.invalidateQueries({
        queryKey: ["orgMembers", org_id],
      });
      await queryClient.invalidateQueries({
        queryKey: ["orgMembersCount", org_id],
      });
    },
  }),
);
