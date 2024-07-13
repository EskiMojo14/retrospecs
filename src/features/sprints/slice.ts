import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { supabase } from "@/db";
import { Tables, TablesInsert, TablesUpdate } from "@/db/supabase";
import { AppDispatch } from "@/store";
import { supabaseQuery } from "@/util/supabase-query";
import { PickRequired } from "@/util/types";
import { emptyApi } from "@/features/api";
import { Team } from "@/features/teams/slice";

type Sprint = Tables<"sprints">;

const sprintAdapter = createEntityAdapter<Sprint>();

export const {
  selectAll: selectAllSprints,
  selectById: selectSprintById,
  selectIds: selectSprintIds,
  selectEntities: selectSprintEntities,
  selectTotal: selectTotalSprints,
} = sprintAdapter.getSelectors();

export const sprintsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Sprint", "Team"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getSprintsForTeam: build.query<
        EntityState<Sprint, Sprint["id"]>,
        Team["id"]
      >({
        queryFn: supabaseQuery(
          (teamId) =>
            supabase.from("sprints").select("*").eq("team_id", teamId),
          {
            transformResponse: (sprints) =>
              sprintAdapter.getInitialState(undefined, sprints),
          },
        ),
        providesTags: (result, _err, teamId) =>
          result
            ? [
                ...result.ids.map((id) => ({ type: "Sprint" as const, id })),
                { type: "Team" as const, id: teamId },
              ]
            : [{ type: "Team" as const, id: teamId }],
      }),
      addSprint: build.mutation<null, TablesInsert<"sprints">>({
        queryFn: supabaseQuery((sprint) =>
          supabase.from("sprints").insert(sprint),
        ),
        invalidatesTags: ["Sprint"],
      }),
      updateSprint: build.mutation<
        null,
        PickRequired<TablesUpdate<"sprints">, "id">
      >({
        queryFn: supabaseQuery(({ id, ...sprint }) =>
          supabase.from("sprints").update(sprint).eq("id", id),
        ),
        invalidatesTags: (_res, _err, { id }) => [{ type: "Sprint", id }],
      }),
      deleteSprint: build.mutation<null, Sprint["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("sprints").delete().eq("id", id),
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

export const setupSprintsRealtime = (dispatch: AppDispatch) =>
  supabase.channel("sprints").on<Sprint>(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "sprints",
    },
    (payload) => {
      switch (payload.eventType) {
        case "INSERT":
          dispatch(
            sprintsApi.util.updateQueryData(
              "getSprintsForTeam",
              payload.new.team_id,
              (data) => sprintAdapter.addOne(data, payload.new),
            ),
          );
          break;
        case "UPDATE":
          dispatch(
            sprintsApi.util.updateQueryData(
              "getSprintsForTeam",
              payload.new.team_id,
              (data) => sprintAdapter.setOne(data, payload.new),
            ),
          );
          break;
        case "DELETE": {
          const teamId = payload.old.team_id;
          const sprintId = payload.old.id;
          if (typeof teamId === "undefined" || typeof sprintId === "undefined")
            return;
          dispatch(
            sprintsApi.util.updateQueryData(
              "getSprintsForTeam",
              teamId,
              (data) => sprintAdapter.removeOne(data, sprintId),
            ),
          );
          break;
        }
      }
    },
  );
