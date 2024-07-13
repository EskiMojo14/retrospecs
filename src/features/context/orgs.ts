import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { supabase } from "@/db";
import { Tables, TablesInsert, TablesUpdate } from "@/db/supabase";
import { supabaseQuery } from "@/util/supabase-query";
import { PickRequired } from "@/util/types";
import { emptyApi } from "@/features/api";

export type Org = Tables<"orgs">;

const orgAdapter = createEntityAdapter<Org>();

export const {
  selectAll: selectAllOrgs,
  selectById: selectOrgById,
  selectIds: selectOrgIds,
  selectEntities: selectOrgEntities,
  selectTotal: selectTotalOrgs,
} = orgAdapter.getSelectors();

export const orgsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Org"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getOrgs: build.query<EntityState<Org, Org["id"]>, void>({
        queryFn: supabaseQuery(() => supabase.from("orgs").select("*"), {
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
      updateOrg: build.mutation<null, PickRequired<TablesUpdate<"orgs">, "id">>(
        {
          queryFn: supabaseQuery(({ id, ...org }) =>
            supabase.from("orgs").update(org).eq("id", id),
          ),
          invalidatesTags: (_res, _err, { id }) => [{ type: "Org", id }],
        },
      ),
      deleteOrg: build.mutation<null, Org["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("orgs").delete().eq("id", id),
        ),
        invalidatesTags: (_res, _err, id) => [{ type: "Org", id }],
      }),
    }),
  });

export const {
  useGetOrgsQuery,
  useAddOrgMutation,
  useUpdateOrgMutation,
  useDeleteOrgMutation,
} = orgsApi;
