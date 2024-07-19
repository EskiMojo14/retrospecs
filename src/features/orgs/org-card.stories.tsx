import type { Meta, StoryObj } from "@storybook/react";
import { makeStore } from "~/store";
import { createReduxDecorator } from "~/util/storybook";
import { OrgCard } from "./org-card";
import { prefillOrgs } from "./storybook";

const store = makeStore();

store.dispatch(
  prefillOrgs([
    {
      id: 1,
      created_at: new Date().toISOString(),
      owner_id: "owner",
      name: "Org Name",
      teamCount: 3,
      memberCount: 5,
    },
  ]),
);

const meta = {
  title: "Features/Orgs/OrgCard",
  component: OrgCard,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orgId: { table: { disable: true } },
  },
  args: { orgId: 1 },
  decorators: [createReduxDecorator({ store })],
} satisfies Meta<typeof OrgCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
