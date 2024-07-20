import type { Meta, StoryObj } from "@storybook/react";
import { createBrowserClient } from "~/db/client";
import { makeStore } from "~/store";
import { applyInjector } from "~/store/endpoint-injector";
import {
  createReduxDecorator,
  createSupabaseDecorator,
} from "~/util/storybook/decorators";
import { TeamCard } from "./team-card";
import type { Team } from ".";
import { injectTeamsApi, teamAdapter } from ".";

const supabase = createBrowserClient();

const store = makeStore();

const team: Team = {
  org_id: 1,
  id: 1,
  created_at: new Date().toISOString(),
  name: "Team Name",
};

const teamsApi = applyInjector(injectTeamsApi, supabase, store.dispatch).api;

void store.dispatch(
  teamsApi.util.upsertQueryData(
    "getTeamsByOrg",
    team.org_id,
    teamAdapter.getInitialState(undefined, [team]),
  ),
);

void store.dispatch(
  teamsApi.util.upsertQueryData("getTeamMemberCount", team.id, 5),
);

const meta = {
  title: "Features/Teams/TeamCard",
  component: TeamCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orgId: { table: { disable: true } },
    teamId: { table: { disable: true } },
  },
  args: { orgId: team.org_id, teamId: team.id },
  decorators: [
    createSupabaseDecorator(supabase),
    createReduxDecorator({ store }),
  ],
} satisfies Meta<typeof TeamCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
