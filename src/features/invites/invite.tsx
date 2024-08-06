import { DialogTrigger, GridListItem } from "react-aria-components";
import { Avatar } from "~/components/avatar";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import DeclineInviteIcon from "~/icons/decline-invite";
import type { InviteWithInviter } from ".";
import styles from "./invite.module.scss";

interface InviteEntryProps {
  id: number;
  invite: InviteWithInviter;
}

const emptyInviter = {
  avatar_url: "",
  color: "gold",
  display_name: "Unknown",
} satisfies InviteWithInviter["inviter"];

export function InviteEntry({ invite }: InviteEntryProps) {
  const inviter = invite.inviter ?? emptyInviter;

  return (
    <GridListItem className={styles.invite}>
      <Avatar
        src={inviter.avatar_url}
        name={inviter.display_name}
        color={inviter.color}
        size="small"
      />
      <div className={styles.details}>
        <Typography variant="overline" className={styles.date}>
          {new Date(invite.created_at).toLocaleDateString()}
        </Typography>
        <Typography variant="subtitle1" className={styles.org}>
          {invite.org_name}
        </Typography>
        <Typography variant="body2" className={styles.inviter}>
          Invited by {inviter.display_name}
        </Typography>
      </div>
      <Toolbar align="end">
        <IconButton tooltip="Accept" variant="filled" color="green">
          <Symbol>mark_email_read</Symbol>
        </IconButton>
        <DialogTrigger>
          <IconButton tooltip="Decline" variant="outlined" color="red">
            <Symbol>
              <DeclineInviteIcon />
            </Symbol>
          </IconButton>
          <ConfirmationDialog
            title={`Decline invite to "${invite.org_name}"`}
            description={
              <>
                Are you sure you want to decline this invite from{" "}
                <b>{inviter.display_name}</b>?{"\n"}
                Once declined, you&apos;ll need to be invited again to join.
              </>
            }
            confirmButtonProps={{
              children: "Decline",
              color: "red",
            }}
            onConfirm={(close) => {
              close();
            }}
          />
        </DialogTrigger>
      </Toolbar>
    </GridListItem>
  );
}
