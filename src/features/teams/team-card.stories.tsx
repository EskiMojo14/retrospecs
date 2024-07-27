import type { Meta, StoryObj } from "@storybook/react";
import { createBrowserClient } from "~/db/client";
import { makeQueryClient } from "~/db/query";
import {
  createQueryClientDecorator,
  createSupabaseDecorator,
} from "~/util/storybook/decorators";
import { TeamCard } from "./team-card";
import type { Team } from ".";
import { getTeamMemberCount, getTeamsByOrg, teamAdapter } from ".";

const supabase = createBrowserClient();

const queryClient = makeQueryClient(Infinity);

const context = { supabase, queryClient };

const team: Team = {
  org_id: 1,
  id: 1,
  created_at: new Date().toISOString(),
  created_by: null,
  name: "Team Name",
};

queryClient.setQueryData(getTeamsByOrg(context, 1).queryKey, () =>
  teamAdapter.getInitialState(undefined, [team]),
);

queryClient.setQueryData(
  getTeamMemberCount(context, team.id).queryKey,
  () => 5,
);

const meta = {
  title: "Features/Teams/TeamCard",
  component: TeamCard,
  argTypes: {
    orgId: { table: { disable: true } },
    teamId: { table: { disable: true } },
  },
  args: { orgId: team.org_id, teamId: team.id },
  decorators: [
    createSupabaseDecorator(supabase),
    createQueryClientDecorator(queryClient),
  ],
} satisfies Meta<typeof TeamCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
