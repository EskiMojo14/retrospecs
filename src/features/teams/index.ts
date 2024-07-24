import { createEntityAdapter } from "@reduxjs/toolkit";
import type { Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import type { Org } from "~/features/orgs";
import {
  compoundKey,
  supabaseFn,
  supabaseMutationOptions,
  supabaseQueryOptions,
} from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Team = Tables<"teams">;
export type TeamMember = Tables<"team_members">;

export const teamAdapter = createEntityAdapter<Team>();

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

export const {
  selectAll: selectAllTeamMembers,
  selectById: selectTeamMemberById,
  selectIds: selectTeamMemberIds,
  selectEntities: selectTeamMemberEntities,
  selectTotal: selectTotalTeamMembers,
} = teamMemberAdapter.getSelectors();

export const teamsApi = {
  getTeamsByOrg: supabaseQueryOptions(({ supabase }, orgId: Org["id"]) => ({
    queryKey: ["teams", orgId],
    queryFn: supabaseFn(
      () => supabase.from("teams").select().eq("org_id", orgId),
      (teams) => teamAdapter.getInitialState(undefined, teams),
    ),
  })),
  getTeamCountByOrg: supabaseQueryOptions(({ supabase }, orgId: Org["id"]) => ({
    queryKey: ["teams", orgId],
    queryFn: supabaseFn(
      () =>
        supabase
          .from("teams")
          .select("*", { count: "exact", head: true })
          .eq("org_id", orgId),
      (_res, { count }) => count ?? 0,
    ),
  })),
  addTeam: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((team: TablesInsert<"teams">) =>
      supabase.from("teams").insert(team),
    ),
    async onSuccess(_: null, { org_id }: TablesInsert<"teams">) {
      await queryClient.invalidateQueries({
        queryKey: ["teams", org_id],
      });
    },
  })),
  updateTeam: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn(
      ({ id, ...team }: PickRequired<TablesUpdate<"teams">, "id">) =>
        supabase.from("teams").update(team).eq("id", id),
    ),
    async onSuccess(
      _: null,
      { org_id }: PickRequired<TablesUpdate<"teams">, "id">,
    ) {
      await queryClient.invalidateQueries({
        queryKey: ["teams", org_id],
      });
    },
  })),
  deleteTeam: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((id: Team["id"]) =>
      supabase.from("teams").delete().eq("id", id),
    ),
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  })),

  getTeamMembers: supabaseQueryOptions(({ supabase }, teamId: Team["id"]) => ({
    queryKey: ["teamMembers", teamId],
    queryFn: supabaseFn(
      () => supabase.from("team_members").select().eq("team_id", teamId),
      (members) => teamMemberAdapter.getInitialState(undefined, members),
    ),
  })),
  getTeamMemberCount: supabaseQueryOptions(
    ({ supabase }, teamId: Team["id"]) => ({
      queryKey: ["teamMembers", teamId],
      queryFn: supabaseFn(
        () =>
          supabase
            .from("team_members")
            .select("*", { count: "exact", head: true })
            .eq("team_id", teamId),
        (_res, { count }) => count ?? 0,
      ),
    }),
  ),
  addTeamMember: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((member: TablesInsert<"team_members">) =>
      supabase.from("team_members").insert(member),
    ),
    async onSuccess(_: null, { team_id }: TablesInsert<"team_members">) {
      await queryClient.invalidateQueries({
        queryKey: ["teamMembers", team_id],
      });
    },
  })),
  updateTeamMember: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn(
      ({
        team_id,
        user_id,
        ...member
      }: PickRequired<TablesUpdate<"team_members">, "team_id" | "user_id">) =>
        supabase
          .from("team_members")
          .update(member)
          .eq("team_id", team_id)
          .eq("user_id", user_id),
    ),
    async onSuccess(
      _: null,
      {
        team_id,
      }: PickRequired<TablesUpdate<"team_members">, "team_id" | "user_id">,
    ) {
      await queryClient.invalidateQueries({
        queryKey: ["teamMembers", team_id],
      });
    },
  })),
  deleteTeamMember: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((member: Pick<TeamMember, "team_id" | "user_id">) =>
      supabase
        .from("team_members")
        .delete()
        .eq("team_id", member.team_id)
        .eq("user_id", member.user_id),
    ),
    async onSuccess(
      _: null,
      { team_id }: Pick<TeamMember, "team_id" | "user_id">,
    ) {
      await queryClient.invalidateQueries({
        queryKey: ["teamMembers", team_id],
      });
    },
  })),
};
