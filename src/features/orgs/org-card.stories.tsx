import type { Meta, StoryObj } from "@storybook/react";
import { createBrowserClient } from "~/db/client";
import { makeQueryClient } from "~/db/query";
import { teamsApi } from "~/features/teams";
import {
  createQueryClientDecorator,
  createSupabaseDecorator,
} from "~/util/storybook/decorators";
import { OrgCard } from "./org-card";
import { orgAdapter, orgsApi } from ".";

const supabase = createBrowserClient();

const queryClient = makeQueryClient(Infinity);

const context = { supabase, queryClient };

queryClient.setQueryData(orgsApi.getOrgs(context).queryKey, () =>
  orgAdapter.getInitialState(undefined, [
    {
      id: 1,
      created_at: new Date().toISOString(),
      name: "Org name",
      owner_id: "1",
    },
  ]),
);

queryClient.setQueryData(
  orgsApi.getOrgMemberCount(context, 1).queryKey,
  () => 5,
);

queryClient.setQueryData(
  teamsApi.getTeamCountByOrg(context, 1).queryKey,
  () => 3,
);

const meta = {
  title: "Features/Orgs/OrgCard",
  component: OrgCard,
  argTypes: {
    orgId: { table: { disable: true } },
  },
  args: { orgId: 1 },
  decorators: [
    createSupabaseDecorator(supabase),
    createQueryClientDecorator(queryClient),
  ],
} satisfies Meta<typeof OrgCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
