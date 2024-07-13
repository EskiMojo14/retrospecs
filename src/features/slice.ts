import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { createAppSlice } from "../pretyped";

export const categories = ["good", "improvement", "neutral", "carry"] as const;

export type Category = (typeof categories)[number];

export interface Feedback {
  id: string;
  sprintId: string;
  category: Category;
  comment: string;
  addressed: boolean;
}

const examples: Feedback[] = [
  {
    id: "1",
    sprintId: "2",
    category: "good",
    comment: "Great job!",
    addressed: false,
  },
  {
    id: "2",
    sprintId: "2",
    category: "good",
    comment:
      "A really long but very positive comment that goes on and on and on",
    addressed: false,
  },
  {
    id: "3",
    sprintId: "2",
    category: "improvement",
    comment: "Needs improvement",
    addressed: false,
  },
  {
    id: "4",
    sprintId: "2",
    category: "neutral",
    comment: "Neutral comment",
    addressed: false,
  },
  {
    id: "5",
    sprintId: "2",
    category: "carry",
    comment: "Carry forward",
    addressed: false,
  },
];

const feedbackAdapter = createEntityAdapter<Feedback>();

const localSelectors = feedbackAdapter.getSelectors();

export const feedbackSlice = createAppSlice({
  name: "feedback",
  initialState: feedbackAdapter.getInitialState(
    {
      carried: feedbackAdapter.getInitialState(undefined, [
        {
          id: "6",
          sprintId: "1",
          category: "carry",
          comment: "Carried forward",
          addressed: false,
        },
      ]),
    },
    examples
  ),
  reducers: (create) => ({
    feedbackAdded: create.reducer(feedbackAdapter.addOne),
    feedbackRemoved: create.reducer(feedbackAdapter.removeOne),
    feedbackUpdated: create.reducer(feedbackAdapter.updateOne),
    feedbackAddressed: create.reducer<{ id: string; addressed: boolean }>(
      (state, action) => {
        const feedback = state.entities[action.payload.id];
        if (feedback) {
          feedback.addressed = action.payload.addressed;
        }
      }
    ),
  }),
  selectors: {
    ...localSelectors,
    selectFeedbackByCategory: createSelector(
      [localSelectors.selectAll, (_: unknown, category: Category) => category],
      (feedback, category) => feedback.filter((f) => f.category === category)
    ),
    selectCarriedFeedback: (state) => localSelectors.selectAll(state.carried),
  },
});

export const {
  feedbackAdded,
  feedbackRemoved,
  feedbackUpdated,
  feedbackAddressed,
} = feedbackSlice.actions;

export const {
  selectAll: selectAllFeedback,
  selectById: selectFeedbackById,
  selectIds: selectFeedbackIds,
  selectEntities: selectFeedbackEntities,
  selectTotal: selectTotalFeedback,
  selectFeedbackByCategory,
  selectCarriedFeedback,
} = feedbackSlice.selectors;
