import { useMutation } from "@tanstack/react-query";
import { Avatar } from "~/components/avatar";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { IconButton } from "~/components/icon-button";
import { ListItem, ListItemText } from "~/components/list";
import { Symbol } from "~/components/symbol";
import { toastQueue } from "~/components/toast";
import { Toolbar } from "~/components/toolbar";
import { useSession } from "~/db/provider";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import DeclineInviteIcon from "~/icons/decline-invite";
import type { PostgrestErrorWithMeta } from "~/util/supabase-query";
import type { InviteWithInviter } from ".";
import { acceptInvite, deleteInvite } from ".";
import styles from "./invite.module.scss";

interface InviteEntryProps {
  invite: InviteWithInviter;
}

const emptyInviter = {
  avatar_url: "",
  color: "gold",
  display_name: "Unknown",
} satisfies InviteWithInviter["inviter"];

export function InviteEntry({ invite }: InviteEntryProps) {
  const session = useSession();
  const inviter = invite.inviter ?? emptyInviter;

  const { mutate: acceptInviteFn } = useMutation(
    useOptionsCreator(acceptInvite),
  );
  const { mutateAsync: deleteInviteFn } = useMutation(
    useOptionsCreator(deleteInvite),
  );

  return (
    <ListItem className={styles.invite} textValue={invite.org_name}>
      <Avatar
        src={inviter.avatar_url}
        name={inviter.display_name}
        color={inviter.color}
      />
      <ListItemText
        overline={new Date(invite.created_at).toLocaleDateString()}
        headline={invite.org_name}
        supporting={`Invited by ${inviter.display_name}`}
      />
      <Toolbar align="end">
        <IconButton
          tooltip="Accept"
          variant="filled"
          color="green"
          onPress={() => {
            if (!session) return;
            acceptInviteFn({
              ...invite,
              user_id: session.user.id,
            });
          }}
        >
          <Symbol>mark_email_read</Symbol>
        </IconButton>

        <ConfirmationDialog
          trigger={
            <IconButton tooltip="Decline" variant="outlined" color="red">
              <Symbol>
                <DeclineInviteIcon />
              </Symbol>
            </IconButton>
          }
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
            deleteInviteFn(invite)
              .then(() => {
                toastQueue.add(
                  {
                    type: "success",
                    title: "Invite declined",
                  },
                  {
                    timeout: 5000,
                  },
                );
              })
              .catch((e: unknown) => {
                toastQueue.add({
                  type: "error",
                  title: "Failed to decline invite",
                  description: (e as PostgrestErrorWithMeta).message,
                });
              });
            close();
          }}
        />
      </Toolbar>
    </ListItem>
  );
}
