import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogTrigger, GridList, GridListItem } from "react-aria-components";
import { Avatar } from "~/components/avatar";
import { Checkbox } from "~/components/checkbox";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { IconButton } from "~/components/icon-button";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useSession } from "~/db/provider";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import {
  Permission,
  useCurrentUserPermissions,
} from "~/hooks/use-user-permissions";
import {
  deleteOrgMember,
  getOrgMembers,
  selectOrgMemberById,
  updateOrgMember,
} from ".";
import styles from "./member-list.module.scss";

export interface MemberRowProps {
  id: string;
  orgId: number;
}

export function MemberRow({ id, orgId }: MemberRowProps) {
  const session = useSession();
  const { data: member } = useQuery({
    ...useOptionsCreator(getOrgMembers, orgId),
    select: (members) => selectOrgMemberById(members, id),
  });
  const { mutate: updateMember } = useMutation(
    useOptionsCreator(updateOrgMember),
  );
  const { mutate: deleteMember } = useMutation(
    useOptionsCreator(deleteOrgMember),
  );
  const permissions = useCurrentUserPermissions(orgId);
  if (!member?.profile) return null;
  const userId = member.user_id;
  return (
    <GridListItem
      textValue={member.profile.display_name}
      className={styles.memberRow}
    >
      <Avatar
        src={member.profile.avatar_url}
        name={member.profile.display_name}
        color={member.profile.color}
        size="small"
      />
      <section className={styles.name} aria-label="User details">
        <Typography variant="body1" className={styles.displayName}>
          {member.profile.display_name}
        </Typography>
        <Typography variant="body2" className={styles.email}>
          {member.profile.email}
        </Typography>
      </section>
      {userId !== session?.user.id && permissions >= Permission.Admin ? (
        <Toolbar align="end" aria-label="Actions" className={styles.actions}>
          <DialogTrigger>
            <Checkbox
              isSelected={member.role === "admin"}
              isDisabled={permissions < Permission.Owner}
              slot={null}
            >
              Admin
            </Checkbox>
            <ConfirmationDialog
              title={member.role === "admin" ? "Demote admin" : "Promote admin"}
              description={
                member.role === "admin"
                  ? `Are you sure you want to demote "${member.profile.display_name}" from admin?`
                  : `Are you sure you want to promote "${member.profile.display_name}" to admin?\nOnce promoted, only the owner can demote them.`
              }
              confirmButtonProps={
                member.role === "admin"
                  ? { children: "Demote", color: "red" }
                  : { children: "Promote", color: "green" }
              }
              onConfirm={() => {
                updateMember({
                  org_id: orgId,
                  user_id: userId,
                  role: member.role === "admin" ? "member" : "admin",
                });
              }}
            />
          </DialogTrigger>
          <DialogTrigger>
            <IconButton tooltip="Remove from group">
              <Symbol>group_remove</Symbol>
            </IconButton>
            <ConfirmationDialog
              title="Remove member"
              description={`Are you sure you want to remove "${member.profile.display_name}" from the group?`}
              confirmButtonProps={{ children: "Remove", color: "red" }}
              onConfirm={() => {
                deleteMember({ org_id: orgId, user_id: userId });
              }}
            />
          </DialogTrigger>
        </Toolbar>
      ) : null}
    </GridListItem>
  );
}

export interface MemberListProps {
  orgId: number;
  memberIds: Array<string>;
}

export function MemberList({ orgId, memberIds }: MemberListProps) {
  return (
    <div className={styles.memberListGrid}>
      <div className={styles.memberListContainer}>
        <LineBackground opacity={0.2}>
          <GridList
            aria-label="Members"
            className={styles.memberList}
            renderEmptyState={() => (
              <div className={styles.empty}>
                <Typography variant="subtitle1" className={styles.emptyTitle}>
                  No members
                </Typography>
                <Typography variant="body2" className={styles.emptyDesc}>
                  Invite members to collaborate on your projects.
                </Typography>
              </div>
            )}
          >
            {memberIds.map((id) => (
              <MemberRow key={id} id={id} orgId={orgId} />
            ))}
          </GridList>
        </LineBackground>
      </div>
    </div>
  );
}
