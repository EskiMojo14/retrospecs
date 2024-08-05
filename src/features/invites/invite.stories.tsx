import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogTrigger, GridList } from "react-aria-components";
import { Badge } from "~/components/badge";
import { IconButton } from "~/components/icon-button";
import { Popover } from "~/components/popover";
import { Symbol } from "~/components/symbol";
import { Heading } from "~/components/typography";
import { InviteEntry } from "./invite";
import type { InviteWithInviter } from ".";

const invite: InviteWithInviter = {
  email: "email@example.com",
  created_at: new Date().toISOString(),
  created_by: "other_user_id",
  user_id: "user_id",
  org_id: 1,
  org_name: "My cool org",
  inviter: {
    display_name: "Inviter Name",
    user_id: "other_user_id",
    color: "blue",
    email: "other-email@example.com",
    avatar_url: "https://avatars.githubusercontent.com/u/18308300?v=4",
  },
};

const meta = {
  title: "Features/Invite/InviteEntry",
  render: () => (
    <DialogTrigger defaultOpen>
      <IconButton tooltip="Invites">
        <Badge badgeContent={2} color="blue">
          <Symbol>mail</Symbol>
        </Badge>
      </IconButton>
      <Popover>
        <Dialog>
          <Heading
            variant="headline6"
            slot="title"
            style={{
              margin: 0,
              marginBottom: "0.5rem",
            }}
          >
            Invites
          </Heading>
          <GridList
            items={Array<InviteWithInviter>(3).fill(invite)}
            id="invites-list"
          >
            {(invite) => <InviteEntry id={invite.org_id} invite={invite} />}
          </GridList>
        </Dialog>
      </Popover>
    </DialogTrigger>
  ),
  args: {},
} satisfies Meta<{}>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
