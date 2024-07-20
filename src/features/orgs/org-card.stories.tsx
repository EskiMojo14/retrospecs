import type { Meta, StoryObj } from "@storybook/react";
import { createBrowserClient } from "~/db/client";
import { applyInjector } from "~/hooks/use-endpoint-injector";
import { makeStore } from "~/store";
import { createReduxDecorator } from "~/util/storybook/decorators";
import { injectTeamsApi } from "../teams";
import { OrgCard } from "./org-card";
import type { Org } from ".";
import { injectOrgsApi, orgAdapter } from ".";

const supabase = createBrowserClient();

const store = makeStore();

const orgsApi = applyInjector(injectOrgsApi, supabase, store.dispatch).api;

const teamsApi = applyInjector(injectTeamsApi, supabase, store.dispatch).api;

interface OrgWithCounts extends Org {
  memberCount: number;
  teamCount: number;
}

const orgs: Array<OrgWithCounts> = [
  {
    id: 1,
    created_at: new Date().toISOString(),
    owner_id: "owner",
    name: "Org Name",
    teamCount: 3,
    memberCount: 5,
  },
];

for (const org of orgs) {
  void store.dispatch(
    orgsApi.util.upsertQueryData("getOrgMemberCount", org.id, org.memberCount),
  );
  void store.dispatch(
    teamsApi.util.upsertQueryData("getTeamCountByOrg", org.id, org.teamCount),
  );
}
void store.dispatch(
  orgsApi.util.upsertQueryData(
    "getOrgs",
    undefined,
    orgAdapter.getInitialState(undefined, orgs),
  ),
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
