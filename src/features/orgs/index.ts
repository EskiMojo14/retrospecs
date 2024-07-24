import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import type { Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import { createEndpointInjector } from "~/store/endpoint-injector";
import {
  compoundKey,
  supabaseQuery,
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

export const injectOrgsApi = createEndpointInjector(
  ({ api: emptyApi, supabase }) => {
    const api = emptyApi
      .enhanceEndpoints({ addTagTypes: ["Org", "OrgMember"] })
      .injectEndpoints({
        endpoints: (build) => ({
          getOrgs: build.query<EntityState<Org, Org["id"]>, void>({
            queryFn: supabaseQuery(() => supabase.from("orgs").select(), {
              transformResponse: (orgs) =>
                orgAdapter.getInitialState(undefined, orgs),
            }),
            providesTags: (result) =>
              result ? result.ids.map((id) => ({ type: "Org", id })) : [],
          }),
          addOrg: build.mutation<null, TablesInsert<"orgs">>({
            queryFn: supabaseQuery((org) => supabase.from("orgs").insert(org)),
            invalidatesTags: ["Org"],
          }),
          updateOrg: build.mutation<
            null,
            PickRequired<TablesUpdate<"orgs">, "id">
          >({
            queryFn: supabaseQuery(({ id, ...org }) =>
              supabase.from("orgs").update(org).eq("id", id),
            ),
            invalidatesTags: (_res, _err, { id }) => [{ type: "Org", id }],
          }),
          deleteOrg: build.mutation<null, Org["id"]>({
            queryFn: supabaseQuery((id) =>
              supabase.from("orgs").delete().eq("id", id),
            ),
            invalidatesTags: (_res, _err, id) => [{ type: "Org", id }],
          }),

          getOrgMemberCount: build.query<number, Org["id"]>({
            queryFn: supabaseQuery(
              (orgId) =>
                supabase
                  .from("org_members")
                  .select("*", { count: "exact", head: true })
                  .eq("org_id", orgId),
              {
                transformResponse: (_res, { count }) => count ?? 0,
              },
            ),
            providesTags: (_res, _err, orgId) => [
              { type: "OrgMember", id: `ORG-${orgId}` },
            ],
          }),
          getOrgMembers: build.query<EntityState<OrgMember, string>, Org["id"]>(
            {
              queryFn: supabaseQuery(
                (orgId) =>
                  supabase.from("org_members").select().eq("org_id", orgId),
                {
                  transformResponse: (members) =>
                    orgMemberAdapter.getInitialState(undefined, members),
                },
              ),
              providesTags: (result, _err, orgId) =>
                result
                  ? [
                      ...result.ids.map((id) => ({
                        type: "OrgMember" as const,
                        id,
                      })),
                      {
                        type: "OrgMember" as const,
                        id: `ORG-${orgId}`,
                      },
                    ]
                  : [
                      {
                        type: "OrgMember" as const,
                        id: `ORG-${orgId}`,
                      },
                    ],
            },
          ),
          addOrgMember: build.mutation<null, TablesInsert<"org_members">>({
            queryFn: supabaseQuery((member) =>
              supabase.from("org_members").insert(member),
            ),
            invalidatesTags: (_result, _err, member) => [
              { type: "OrgMember", id: `ORG-${member.org_id}` },
            ],
          }),
          updateOrgMember: build.mutation<
            null,
            PickRequired<TablesUpdate<"org_members">, "org_id" | "user_id">
          >({
            queryFn: supabaseQuery(({ org_id, user_id, ...member }) =>
              supabase
                .from("org_members")
                .update(member)
                .eq("org_id", org_id)
                .eq("user_id", user_id),
            ),
            invalidatesTags: (_result, _err, member) => [
              { type: "OrgMember" as const, id: selectOrgMemberId(member) },
            ],
          }),
          deleteOrgMember: build.mutation<
            null,
            Pick<OrgMember, "org_id" | "user_id">
          >({
            queryFn: supabaseQuery((member) =>
              supabase
                .from("org_members")
                .delete()
                .eq("org_id", member.org_id)
                .eq("user_id", member.user_id),
            ),
            invalidatesTags: (_result, _err, member) => [
              { type: "OrgMember", id: selectOrgMemberId(member) },
            ],
          }),
        }),
        overrideExisting: true,
      });
    return { api };
  },
);

export const getOrgsOptions = supabaseQueryOptions(({ supabase }) => ({
  queryKey: ["orgs"],
  queryFn: supabaseFn(
    () => supabase.from("orgs").select(),
    (orgs) => orgAdapter.getInitialState(undefined, orgs),
  ),
}));

export const addOrgMutationOptions = supabaseMutationOptions(
  ({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((org: TablesInsert<"orgs">) =>
      supabase.from("orgs").insert(org),
    ),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["orgs"],
      });
    },
  }),
);
