import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { supabase } from "@/db";
import { Tables, TablesInsert, TablesUpdate } from "@/db/supabase";
import { compoundKey, supabaseQuery } from "@/util/supabase-query";
import { PickRequired } from "@/util/types";
import { emptyApi } from "@/features/api";
import { Org } from "../orgs";

export type Team = Tables<"teams">;
export type TeamMember = Tables<"team_members">;

const teamAdapter = createEntityAdapter<Team>();

export const {
  selectAll: selectAllTeams,
  selectById: selectTeamById,
  selectIds: selectTeamIds,
  selectEntities: selectTeamEntities,
  selectTotal: selectTotalTeams,
} = teamAdapter.getSelectors();

const selectTeamMemberId = compoundKey<TeamMember>()("team_id", "user_id");

const teamMemberAdapter = createEntityAdapter<TeamMember, string>({
  selectId: selectTeamMemberId,
});

export const teamsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Team", "TeamMember"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getTeamsByOrg: build.query<EntityState<Team, Team["id"]>, Org["id"]>({
        queryFn: supabaseQuery(
          (orgId) => supabase.from("teams").select().eq("org_id", orgId),
          {
            transformResponse: (teams) =>
              teamAdapter.getInitialState(undefined, teams),
          },
        ),
        providesTags: (result) =>
          result ? result.ids.map((id) => ({ type: "Team", id })) : [],
      }),
      addTeam: build.mutation<null, TablesInsert<"teams">>({
        queryFn: supabaseQuery((team) => supabase.from("teams").insert(team)),
        invalidatesTags: ["Team"],
      }),
      updateTeam: build.mutation<
        null,
        PickRequired<TablesUpdate<"teams">, "id">
      >({
        queryFn: supabaseQuery(({ id, ...team }) =>
          supabase.from("teams").update(team).eq("id", id),
        ),
        invalidatesTags: (_res, _err, { id }) => [{ type: "Team", id }],
      }),
      deleteTeam: build.mutation<null, Team["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("teams").delete().eq("id", id),
        ),
        invalidatesTags: (_res, _err, id) => [{ type: "Team", id }],
      }),

      getTeamMembers: build.query<EntityState<TeamMember, string>, Team["id"]>({
        queryFn: supabaseQuery(
          (teamId) =>
            supabase.from("team_members").select().eq("team_id", teamId),
          {
            transformResponse: (members) =>
              teamMemberAdapter.getInitialState(undefined, members),
          },
        ),
        providesTags: (result, _err, teamId) =>
          result
            ? [
                ...result.ids.map((id) => ({
                  type: "TeamMember" as const,
                  id,
                })),
                { type: "TeamMember" as const, id: `TEAM-${teamId}` },
                { type: "Team" as const, id: teamId },
              ]
            : [{ type: "Team", id: teamId }],
      }),
      addTeamMember: build.mutation<null, TablesInsert<"team_members">>({
        queryFn: supabaseQuery((member) =>
          supabase.from("team_members").insert(member),
        ),
        invalidatesTags: (_result, _err, member) => [
          { type: "TeamMember", id: `TEAM-${member.team_id}` },
        ],
      }),
      updateTeamMember: build.mutation<
        null,
        PickRequired<TablesUpdate<"team_members">, "team_id" | "user_id">
      >({
        queryFn: supabaseQuery(({ team_id, user_id, ...member }) =>
          supabase
            .from("team_members")
            .update(member)
            .eq("team_id", team_id)
            .eq("user_id", user_id),
        ),
        invalidatesTags: (_res, _err, member) => [
          { type: "TeamMember" as const, id: selectTeamMemberId(member) },
        ],
      }),
      deleteTeamMember: build.mutation<
        null,
        Pick<TeamMember, "team_id" | "user_id">
      >({
        queryFn: supabaseQuery((member) =>
          supabase
            .from("team_members")
            .delete()
            .eq("team_id", member.team_id)
            .eq("user_id", member.user_id),
        ),
        invalidatesTags: (_res, _err, member) => [
          { type: "TeamMember", id: selectTeamMemberId(member) },
        ],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetTeamsByOrgQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamMembersQuery,
  useAddTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamsApi;
