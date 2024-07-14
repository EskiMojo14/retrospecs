import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { supabase } from "@/db";
import { Tables, TablesInsert, TablesUpdate } from "@/db/supabase";
import { supabaseQuery } from "@/util/supabase-query";
import { PickRequired } from "@/util/types";
import { emptyApi } from "@/features/api";
import { buildRealtimeHandler } from "@/db/realtime";
import { Sprint } from "@/features/sprints/slice";

export type Feedback = Tables<"feedback">;

const feedbackAdapter = createEntityAdapter<Feedback>();

export const {
  selectAll: selectAllFeedback,
  selectById: selectFeedbackById,
  selectIds: selectFeedbackIds,
  selectEntities: selectFeedbackEntities,
  selectTotal: selectTotalFeedback,
} = feedbackAdapter.getSelectors();

export const feedbackApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Feedback", "Sprint"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getFeedbackBySprint: build.query<
        EntityState<Feedback, Feedback["id"]>,
        Sprint["id"]
      >({
        queryFn: supabaseQuery(
          (sprintId) =>
            supabase.from("feedback").select("*").eq("sprint_id", sprintId),
          {
            transformResponse: (feedback) =>
              feedbackAdapter.getInitialState(undefined, feedback),
          },
        ),
        providesTags: (result, _err, sprintId) =>
          result
            ? [
                ...result.ids.map((id) => ({ type: "Feedback" as const, id })),
                { type: "Sprint" as const, id: sprintId },
              ]
            : [{ type: "Sprint" as const, id: sprintId }],
      }),
      addFeedback: build.mutation<null, TablesInsert<"feedback">>({
        queryFn: supabaseQuery((feedback) =>
          supabase.from("feedback").insert(feedback),
        ),
        invalidatesTags: ["Feedback"],
      }),
      updateFeedback: build.mutation<
        null,
        PickRequired<TablesUpdate<"feedback">, "id">
      >({
        queryFn: supabaseQuery(({ id, ...feedback }) =>
          supabase.from("feedback").update(feedback).eq("id", id),
        ),
        invalidatesTags: (_res, _err, { id }) => [{ type: "Feedback", id }],
      }),
      deleteFeedback: build.mutation<null, Feedback["id"]>({
        queryFn: supabaseQuery((id) =>
          supabase.from("feedback").delete().eq("id", id),
        ),
        invalidatesTags: (_res, _err, id) => [{ type: "Feedback", id }],
      }),
    }),
    overrideExisting: true,
  });

export const setupFeedbackRealtime = buildRealtimeHandler("feedback", {
  insert: (payload, dispatch) =>
    dispatch(
      feedbackApi.util.updateQueryData(
        "getFeedbackBySprint",
        payload.new.sprint_id,
        (draft) => feedbackAdapter.addOne(draft, payload.new),
      ),
    ),
  update: (payload, dispatch) =>
    dispatch(
      feedbackApi.util.updateQueryData(
        "getFeedbackBySprint",
        payload.new.sprint_id,
        (draft) =>
          feedbackAdapter.updateOne(draft, {
            id: payload.old.id ?? payload.new.id,
            changes: payload.new,
          }),
      ),
    ),
  delete: (payload, dispatch) => {
    const sprintId = payload.old.sprint_id;
    const feedbackId = payload.old.id;
    if (typeof sprintId === "undefined" || typeof feedbackId === "undefined")
      return;
    dispatch(
      feedbackApi.util.updateQueryData(
        "getFeedbackBySprint",
        sprintId,
        (draft) => feedbackAdapter.removeOne(draft, feedbackId),
      ),
    );
  },
});
