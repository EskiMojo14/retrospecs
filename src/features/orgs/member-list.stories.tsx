import type { Meta, StoryObj } from "@storybook/react";
import { createBrowserClient } from "~/db/client";
import { makeQueryClient } from "~/db/query";
import {
  createQueryClientDecorator,
  createSupabaseDecorator,
} from "~/util/storybook/decorators";
import { MemberList } from "./member-list";
import { getOrgMembers, orgMemberAdapter, selectOrgMemberIds } from ".";

const supabase = createBrowserClient();

const queryClient = makeQueryClient(Infinity);

const context = { supabase, queryClient };

const members = orgMemberAdapter.getInitialState(undefined, [
  {
    created_at: new Date().toISOString(),
    user_id: "1",
    org_id: 1,
    role: "member",
    profile: {
      user_id: "1",
      display_name: "User name",
      avatar_url: null,
      color: "gold",
      email: "email@example.com",
    },
  },
  {
    created_at: new Date().toISOString(),
    user_id: "2",
    org_id: 1,
    role: "admin",
    profile: {
      user_id: "2",
      display_name: "Admin name",
      avatar_url: null,
      color: "blue",
      email: "admin@example.com",
    },
  },
]);

queryClient.setQueryData(getOrgMembers(context, 1).queryKey, members);

queryClient.setQueryData(
  getOrgMembers(context, 2).queryKey,
  orgMemberAdapter.getInitialState(),
);

const meta = {
  title: "Features/Orgs/MemberList",
  component: MemberList,
  argTypes: {
    orgId: { table: { disable: true } },
    memberIds: { table: { disable: true } },
  },
  args: { orgId: 1 },
  decorators: [
    createSupabaseDecorator(supabase),
    createQueryClientDecorator(queryClient),
  ],
} satisfies Meta<typeof MemberList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    memberIds: selectOrgMemberIds(members),
  },
};

export const Empty: Story = {
  args: { orgId: 2, memberIds: [] },
};
