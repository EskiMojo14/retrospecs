import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogTrigger } from "react-aria-components";
import { Badge } from "~/components/badge";
import { EmptyState } from "~/components/empty";
import { IconButton } from "~/components/icon-button";
import { Popover } from "~/components/popover";
import { Symbol } from "~/components/symbol";
import { Heading } from "~/components/typography";
import { useSession } from "~/db/provider";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { pluralize } from "~/util";
import { InviteEntry } from "./invite";
import { getInvitesByUserId, inviteAdapter, selectAllInvites } from ".";
import styles from "./invites.module.scss";
import { List } from "~/components/list";

export function Invites({ isOpen }: { isOpen?: boolean }) {
  const session = useSession();
  const { data: invites = [] } = useQuery({
    ...useOptionsCreator(getInvitesByUserId, session?.user.id),
    placeholderData: inviteAdapter.getInitialState(),
    select: selectAllInvites,
  });
  return (
    <DialogTrigger {...{ isOpen }}>
      <IconButton
        slot="action"
        tooltip={pluralize`${invites.length} ${[invites.length, "invite"]}`}
      >
        <Badge badgeContent={invites.length} max={99} color="blue">
          <Symbol>mail</Symbol>
        </Badge>
      </IconButton>
      <Popover className={styles.popover} placement="bottom end">
        <Dialog className={styles.dialog}>
          <Heading variant="subtitle1" slot="title" className={styles.title}>
            Invites
          </Heading>
          <List
            variant="three-line"
            items={invites}
            id="invites-list"
            className={styles.list}
            renderEmptyState={() => (
              <EmptyState
                icon={<Symbol>inbox</Symbol>}
                title="No invites"
                description={`Ask to be invited to an organisation,\nor create your own.`}
                size="small"
              />
            )}
          >
            {(invite) => <InviteEntry id={invite.org_id} invite={invite} />}
          </List>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
