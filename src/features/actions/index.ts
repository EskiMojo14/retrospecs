import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { supabase } from "~/db";
import { buildRealtimeHandler } from "~/db/realtime";
import type { Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import { emptyApi } from "~/features/api";
import type { Sprint } from "~/features/sprints";
import { supabaseQuery } from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Action = Tables<"actions">;

const actionAdapter = createEntityAdapter<Action>();

export const {
  selectAll: selectAllActions,
  selectById: selectActionById,
  selectIds: selectActionIds,
  selectEntities: selectActionEntities,
  selectTotal: selectTotalActions,
} = actionAdapter.getSelectors();

export const actionsApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Action"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getActionsBySprint: build.query<
        EntityState<Action, Action["id"]>,
        Sprint["id"]
      >({
        queryFn: supabaseQuery(
          (sprintId) =>
            supabase.from("actions").select().eq("sprint_id", sprintId),
          {
            transformResponse: (actions) =>
              actionAdapter.getInitialState(undefined, actions),
          },
        ),
        providesTags: (result, _err, sprintId) =>
          result
            ? [
                ...result.ids.map((id) => ({ type: "Action" as const, id })),
                { type: "Action" as const, id: `SPRINT-${sprintId}` },
              ]
            : [{ type: "Action" as const, id: `SPRINT-${sprintId}` }],
      }),
      addAction: build.mutation<null, TablesInsert<"actions">>({
        queryFn: supabaseQuery((action) =>
          supabase.from("actions").insert(action),
        ),
        invalidatesTags: ["Action"],
      }),
      updateAction: build.mutation<
        null,
        PickRequired<TablesUpdate<"actions">, "id">
      >({
        queryFn: supabaseQuery(({ id, ...action }) =>
          supabase.from("actions").update(action).eq("id", id),
        ),
        invalidatesTags: (_res, _err, { id }) => [{ type: "Action", id }],
      }),
      deleteAction: build.mutation<null, Action["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("actions").delete().eq("id", id),
        ),
        invalidatesTags: (_res, _err, id) => [{ type: "Action", id }],
      }),
    }),
    overrideExisting: true,
  });

export const {
  useGetActionsBySprintQuery,
  useAddActionMutation,
  useUpdateActionMutation,
  useDeleteActionMutation,
} = actionsApi;

export const setupActionsRealtime = buildRealtimeHandler("actions", {
  insert: (payload, dispatch) =>
    dispatch(
      actionsApi.util.updateQueryData(
        "getActionsBySprint",
        payload.new.sprint_id,
        (draft) => actionAdapter.addOne(draft, payload.new),
      ),
    ),
  update: (payload, dispatch) =>
    dispatch(
      actionsApi.util.updateQueryData(
        "getActionsBySprint",
        payload.new.sprint_id,
        (draft) =>
          actionAdapter.updateOne(draft, {
            id: payload.old.id ?? payload.new.id,
            changes: payload.new,
          }),
      ),
    ),
  delete: (payload, dispatch) => {
    const sprintId = payload.old.sprint_id;
    const actionId = payload.old.id;
    if (typeof sprintId === "undefined" || typeof actionId === "undefined")
      return;
    dispatch(
      actionsApi.util.updateQueryData("getActionsBySprint", sprintId, (draft) =>
        actionAdapter.removeOne(draft, actionId),
      ),
    );
  },
});
