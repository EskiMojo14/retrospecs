import type { EntityState } from "@reduxjs/toolkit";
import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { supabase } from "~/db";
import { buildRealtimeHandler } from "~/db/realtime";
import type { Enums, Tables, TablesInsert, TablesUpdate } from "~/db/supabase";
import { emptyApi } from "~/features/api";
import type { Sprint } from "~/features/sprints";
import { groupBy } from "~/util";
import { compoundKey, supabaseQuery } from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Feedback = Tables<"feedback">;
export type Reaction = Tables<"reactions">;

const feedbackAdapter = createEntityAdapter<Feedback>();

export const {
  selectAll: selectAllFeedback,
  selectById: selectFeedbackById,
  selectIds: selectFeedbackIds,
  selectEntities: selectFeedbackEntities,
  selectTotal: selectTotalFeedback,
} = feedbackAdapter.getSelectors();

export const selectFeedbackByCategories = createSelector(
  selectAllFeedback,
  (feedback) => groupBy(feedback, (f) => f.category),
);

export const selectFeedbackByCategory = (
  state: EntityState<Feedback, Feedback["id"]>,
  category: Enums<"category">,
) => selectFeedbackByCategories(state)[category];

const selectReactionId = compoundKey<Reaction>()(
  "feedback_id",
  "user_id",
  "reaction",
);

const reactionAdapter = createEntityAdapter<Reaction, string>({
  selectId: selectReactionId,
});

export const {
  selectAll: selectAllReactions,
  selectById: selectReactionById,
  selectIds: selectReactionIds,
  selectEntities: selectReactionEntities,
  selectTotal: selectTotalReactions,
} = reactionAdapter.getSelectors();

export const selectReactionsByTypes = createSelector(
  selectAllReactions,
  (reactions) => groupBy(reactions, (r) => r.reaction),
);

export const selectReactionsByType = (
  state: EntityState<Reaction, string>,
  reaction: Enums<"reaction">,
) => selectReactionsByTypes(state)[reaction];

export const feedbackApi = emptyApi
  .enhanceEndpoints({ addTagTypes: ["Feedback", "Reaction"] })
  .injectEndpoints({
    endpoints: (build) => ({
      getFeedbackBySprint: build.query<
        EntityState<Feedback, Feedback["id"]>,
        Sprint["id"]
      >({
        queryFn: supabaseQuery(
          (sprintId) =>
            supabase.from("feedback").select().eq("sprint_id", sprintId),
          {
            transformResponse: (feedback) =>
              feedbackAdapter.getInitialState(undefined, feedback),
          },
        ),
        providesTags: (result, _err, sprintId) =>
          result
            ? [
                ...result.ids.map((id) => ({ type: "Feedback" as const, id })),
                { type: "Feedback" as const, id: `SPRINT-${sprintId}` },
              ]
            : [{ type: "Feedback" as const, id: `SPRINT-${sprintId}` }],
      }),
      addFeedback: build.mutation<null, TablesInsert<"feedback">>({
        queryFn: supabaseQuery((feedback) =>
          supabase.from("feedback").insert(feedback),
        ),
        invalidatesTags: (_result, _error, { sprint_id }) => [
          { type: "Feedback", id: `SPRINT-${sprint_id}` },
        ],
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

      getReactionsByFeedback: build.query<
        EntityState<Reaction, string>,
        Feedback["id"]
      >({
        queryFn: supabaseQuery(
          (feedbackId) =>
            supabase.from("reactions").select().eq("feedback_id", feedbackId),
          {
            transformResponse: (reactions) =>
              reactionAdapter.getInitialState(undefined, reactions),
          },
        ),
        providesTags: (result, _err, feedbackId) =>
          result
            ? [
                ...result.ids.map((id) => ({
                  type: "Reaction" as const,
                  id,
                })),
                { type: "Reaction" as const, id: `FEEDBACK-${feedbackId}` },
              ]
            : [{ type: "Reaction" as const, id: `FEEDBACK-${feedbackId}` }],
      }),
      addReaction: build.mutation<null, TablesInsert<"reactions">>({
        queryFn: supabaseQuery((reaction) =>
          supabase.from("reactions").insert(reaction),
        ),
        invalidatesTags: (_result, _err, { feedback_id }) => [
          { type: "Reaction", id: `FEEDBACK-${feedback_id}` },
        ],
      }),
      deleteReaction: build.mutation<
        null,
        Parameters<typeof selectReactionId>[0]
      >({
        queryFn: supabaseQuery(({ feedback_id, user_id, reaction }) =>
          supabase
            .from("reactions")
            .delete()
            .eq("feedback_id", feedback_id)
            .eq("user_id", user_id)
            .eq("reaction", reaction),
        ),
        invalidatesTags: (_result, _err, reaction) => [
          { type: "Reaction" as const, id: selectReactionId(reaction) },
        ],
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

export const setupReactionRealtime = buildRealtimeHandler("reactions", {
  insert: (payload, dispatch) =>
    dispatch(
      feedbackApi.util.updateQueryData(
        "getReactionsByFeedback",
        payload.new.feedback_id,
        (draft) => reactionAdapter.addOne(draft, payload.new),
      ),
    ),
  delete: (payload, dispatch) => {
    const { user_id, feedback_id, reaction } = payload.old;
    if (
      typeof reaction === "undefined" ||
      typeof user_id === "undefined" ||
      typeof feedback_id === "undefined"
    )
      return;
    dispatch(
      feedbackApi.util.updateQueryData(
        "getReactionsByFeedback",
        feedback_id,
        (draft) =>
          reactionAdapter.removeOne(
            draft,
            selectReactionId({ user_id, feedback_id, reaction }),
          ),
      ),
    );
  },
});
