import type { Meta, StoryObj } from "@storybook/react";
import { OrgCard } from "./org-card";
import type { Org } from ".";
import { orgAdapter, orgsApi } from ".";
import { makeStore } from "@/store";
import { createReduxDecorator } from "@/util/storybook";

const store = makeStore();

const org: Org = {
  id: 1,
  created_at: new Date().toISOString(),
  owner_id: "owner",
  name: "Org Name",
};

void store.dispatch(
  orgsApi.util.upsertQueryData(
    "getOrgs",
    undefined,
    orgAdapter.getInitialState(undefined, [org]),
  ),
);

void store.dispatch(
  orgsApi.util.upsertQueryData("getOrgMemberCount", org.id, 5),
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
  args: { orgId: org.id },
  decorators: [createReduxDecorator({ store })],
} satisfies Meta<typeof OrgCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
