import type { Meta, StoryObj } from "@storybook/react";
import { makeStore } from "~/store";
import { createReduxDecorator } from "~/util/storybook/decorators";
import { TeamCard } from "./team-card";
import type { Team } from ".";
import { teamAdapter, teamsApi } from ".";

const store = makeStore();

const team: Team = {
  org_id: 1,
  id: 1,
  created_at: new Date().toISOString(),
  name: "Team Name",
};

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
  decorators: [createReduxDecorator({ store })],
} satisfies Meta<typeof TeamCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
