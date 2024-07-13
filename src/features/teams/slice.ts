import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { supabase } from "@/db";
import { Tables, TablesInsert, TablesUpdate } from "@/db/supabase";
import { supabaseQuery } from "@/util/supabase-query";
import { PickRequired } from "@/util/types";
import { emptyApi } from "@/features/api";

export type Team = Tables<"teams">;

const teamAdapter = createEntityAdapter<Team>();

export const {
  selectAll: selectAllTeams,
  selectById: selectTeamById,
  selectIds: selectTeamIds,
  selectEntities: selectTeamEntities,
  selectTotal: selectTotalTeams,
} = teamAdapter.getSelectors();

export const teamsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Team"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getTeams: build.query<EntityState<Team, Team["id"]>, void>({
        queryFn: supabaseQuery(() => supabase.from("teams").select("*"), {
          transformResponse: (teams) =>
            teamAdapter.getInitialState(undefined, teams),
        }),
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
    }),
  });

export const {
  useGetTeamsQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamsApi;
