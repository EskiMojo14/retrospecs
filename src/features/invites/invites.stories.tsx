import type { Meta, StoryObj } from "@storybook/react";
import { Invites } from "./invites";
import type { InviteWithInviter } from ".";

const invite: InviteWithInviter = {
  email: "email@example.com",
  created_at: new Date().toISOString(),
  created_by: "other_user_id",
  user_id: "user_id",
  org_id: 1,
  org_name: "Org Name",
  inviter: {
    display_name: "Inviter Name",
    user_id: "other_user_id",
    color: "blue",
    email: "other-email@example.com",
    avatar_url: "https://avatars.githubusercontent.com/u/18308300?v=4",
  },
};

const meta = {
  title: "Features/Invite/Invites",
  component: Invites,
  argTypes: {
    invites: { table: { disable: true } },
    isOpen: { table: { disable: true } },
  },
  args: {
    invites: [
      {
        ...invite,
        org_id: 0,
        org_name:
          "Incredibly long organization name that is so long it gets cut off",
      },
      ...Array<InviteWithInviter>(7).fill(invite),
    ].map((invite, n) => ({
      ...invite,
      org_id: n + 1,
    })),
    isOpen: true,
  },
} satisfies Meta<typeof Invites>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Empty: Story = {
  args: {
    invites: [],
  },
};
