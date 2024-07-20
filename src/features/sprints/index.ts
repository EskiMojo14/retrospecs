import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { buildRealtimeHandler } from "~/db/realtime";
import type { Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import { emptyApi } from "~/features/api";
import type { Team } from "~/features/teams";
import { createEndpointInjector } from "~/store/endpoint-injector";
import { supabaseQuery } from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Sprint = Tables<"sprints">;

const sprintAdapter = createEntityAdapter<Sprint>();

export const {
  selectAll: selectAllSprints,
  selectById: selectSprintById,
  selectIds: selectSprintIds,
  selectEntities: selectSprintEntities,
  selectTotal: selectTotalSprints,
} = sprintAdapter.getSelectors();

export const injectSprintsApi = createEndpointInjector((supabase, dispatch) => {
  const api = emptyApi
    .enhanceEndpoints({ addTagTypes: ["Sprint"] })
    .injectEndpoints({
      endpoints: (build) => ({
        getSprintsForTeam: build.query<
          EntityState<Sprint, Sprint["id"]>,
          Team["id"]
        >({
          queryFn: supabaseQuery(
            (teamId) => supabase.from("sprints").select().eq("team_id", teamId),
            {
              transformResponse: (sprints) =>
                sprintAdapter.getInitialState(undefined, sprints),
            },
          ),
          providesTags: (result, _err, teamId) =>
            result
              ? [
                  ...result.ids.map((id) => ({ type: "Sprint" as const, id })),
                  { type: "Sprint" as const, id: `TEAM-${teamId}` },
                ]
              : [{ type: "Sprint" as const, id: `TEAM-${teamId}` }],
        }),
        getSprintById: build.query<Sprint, Sprint["id"]>({
          queryFn: supabaseQuery((id) =>
            supabase.from("sprints").select().eq("id", id).single(),
          ),
          providesTags: (_result, _err, id) => [{ type: "Sprint", id }],
        }),
        addSprint: build.mutation<null, TablesInsert<"sprints">>({
          queryFn: supabaseQuery((sprint) =>
            supabase.from("sprints").insert(sprint),
          ),
          invalidatesTags: (_res, _err, { team_id }) => [
            { type: "Sprint", id: `TEAM-${team_id}` },
          ],
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
      overrideExisting: true,
    });

  return {
    api,
    realtime: buildRealtimeHandler(supabase, "sprints", {
      insert: (payload) =>
        dispatch(
          api.util.updateQueryData(
            "getSprintsForTeam",
            payload.new.team_id,
            (data) => sprintAdapter.addOne(data, payload.new),
          ),
        ),
      update: (payload) => {
        const sprintId = payload.old.id ?? payload.new.id;
        dispatch(
          api.util.updateQueryData(
            "getSprintsForTeam",
            payload.new.team_id,
            (data) =>
              sprintAdapter.updateOne(data, {
                id: sprintId,
                changes: payload.new,
              }),
          ),
        );
        dispatch(
          api.util.updateQueryData(
            "getSprintById",
            sprintId,
            () => payload.new,
          ),
        );
      },
      delete: (payload) => {
        const teamId = payload.old.team_id;
        const sprintId = payload.old.id;
        if (typeof teamId === "undefined" || typeof sprintId === "undefined")
          return;
        dispatch(
          api.util.updateQueryData("getSprintsForTeam", teamId, (data) =>
            sprintAdapter.removeOne(data, sprintId),
          ),
        );
      },
    }),
  };
});
