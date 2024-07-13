import {
  integer,
  timestamp,
  text,
  boolean,
  pgTable,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const id = integer("id").primaryKey().generatedAlwaysAsIdentity();
const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .generatedAlwaysAs(sql`now()`);

export const teams = pgTable("teams", {
  id,
  createdAt,
  name: text("name").notNull(),
});

export type TeamInput = typeof teams.$inferInsert;
export type Team = typeof teams.$inferSelect;

export const sprints = pgTable("sprints", {
  id,
  createdAt,
  teamId: integer("team_id")
    .references(() => teams.id)
    .notNull(),
  name: text("name").notNull(),
  followsId: integer("follows_id"),
});

export type SprintInput = typeof sprints.$inferInsert;
export type Sprint = typeof sprints.$inferSelect;

export const sprintRelations = relations(sprints, ({ one }) => ({
  team: one(teams, {
    fields: [sprints.teamId],
    references: [teams.id],
  }),
  follows: one(sprints, {
    fields: [sprints.followsId],
    references: [sprints.id],
  }),
}));

export const feedback = pgTable("feedback", {
  id,
  createdAt,
  sprintId: integer("sprint_id")
    .references(() => sprints.id)
    .notNull(),
  feedback: text("feedback").notNull(),
  addressed: boolean("addressed").notNull().default(false),
});

export type FeedbackInput = typeof feedback.$inferInsert;
export type Feedback = typeof feedback.$inferSelect;

export const feedbackRelations = relations(feedback, ({ one }) => ({
  sprint: one(sprints, {
    fields: [feedback.sprintId],
    references: [sprints.id],
  }),
}));

export const actions = pgTable("actions", {
  id,
  createdAt,
  action: text("action").notNull(),
  sprintId: integer("sprint_id")
    .references(() => sprints.id)
    .notNull(),
  addressed: boolean("addressed").notNull().default(false),
});

export type ActionInput = typeof actions.$inferInsert;
export type Action = typeof actions.$inferSelect;

export const actionsRelations = relations(actions, ({ one }) => ({
  sprint: one(sprints, {
    fields: [actions.sprintId],
    references: [sprints.id],
  }),
}));
