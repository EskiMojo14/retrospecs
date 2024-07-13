import { supabase } from "../../db";
import { Tables, TablesInsert, TablesUpdate } from "../../db/supabase";
import { supabaseQuery } from "../../util/supabase-query";
import { PickRequired } from "../../util/types";
import { emptyApi } from "../api";
import { Team } from "../teams/slice";

type Sprint = Tables<"sprints">;

export const sprintsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Sprint", "Team"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSprintsForTeam: build.query<Sprint[], Team["id"]>({
        queryFn: supabaseQuery((teamId) =>
          supabase.from("sprints").select("*").eq("team_id", teamId)
        ),
        providesTags: (result, _err, teamId) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: "Sprint" as const, id })),
                { type: "Team", id: teamId },
              ]
            : [{ type: "Team", id: teamId }],
      }),
      addSprint: build.mutation<null, TablesInsert<"sprints">>({
        queryFn: supabaseQuery((sprint) =>
          supabase.from("sprints").insert(sprint)
        ),
        invalidatesTags: ["Sprint"],
      }),
      updateSprint: build.mutation<
        null,
        PickRequired<TablesUpdate<"sprints">, "id">
      >({
        queryFn: supabaseQuery(({ id, ...sprint }) =>
          supabase.from("sprints").update(sprint).eq("id", id)
        ),
        invalidatesTags: (_res, _err, { id }) => [{ type: "Sprint", id }],
      }),
      deleteSprint: build.mutation<null, Sprint["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("sprints").delete().eq("id", id)
        ),
        invalidatesTags: (_res, _err, id) => [{ type: "Sprint", id }],
      }),
    }),
  });

export const {
  useGetSprintsForTeamQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsApi;
