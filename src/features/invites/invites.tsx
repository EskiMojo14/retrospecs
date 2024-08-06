import { Dialog, DialogTrigger, GridList } from "react-aria-components";
import { Badge } from "~/components/badge";
import { IconButton } from "~/components/icon-button";
import { Popover } from "~/components/popover";
import { Symbol } from "~/components/symbol";
import { Heading, Typography } from "~/components/typography";
import { pluralize } from "~/util";
import { InviteEntry } from "./invite";
import type { InviteWithInviter } from ".";
import styles from "./invites.module.scss";

export function Invites({
  invites,
  isOpen,
}: {
  invites: Array<InviteWithInviter>;
  isOpen?: boolean;
}) {
  /*
  const session = useSession();
  const { data: invites = [] } = useQuery({
    ...useOptionsCreator(getInvitesByUserId, session?.user.id),
    placeholderData: inviteAdapter.getInitialState(),
    select: selectAllInvites,
  });
  */
  return (
    <DialogTrigger {...{ isOpen }}>
      <IconButton
        tooltip={pluralize`${invites.length} ${[invites.length, "invite"]}`}
      >
        <Badge badgeContent={invites.length} max={99} color="blue">
          <Symbol>mail</Symbol>
        </Badge>
      </IconButton>
      <Popover className={styles.popover}>
        <Dialog className={styles.dialog}>
          <Heading variant="subtitle1" slot="title" className={styles.title}>
            Invites
          </Heading>
          <GridList
            items={invites}
            id="invites-list"
            className={styles.list}
            renderEmptyState={() => (
              <div className={styles.empty}>
                <Typography variant="body2">No invites</Typography>
              </div>
            )}
          >
            {(invite) => <InviteEntry id={invite.org_id} invite={invite} />}
          </GridList>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
