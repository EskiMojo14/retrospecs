import { useMutation, useQuery } from "@tanstack/react-query";
import { DialogTrigger, Text } from "react-aria-components";
import { Avatar } from "~/components/avatar";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { EmptyState } from "~/components/empty";
import { IconButton } from "~/components/icon-button";
import { LineBackground } from "~/components/line-background";
import { List, ListItem, ListItemText } from "~/components/list";
import { Switch } from "~/components/switch";
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
    <ListItem
      textValue={member.profile.display_name}
      className={styles.memberRow}
    >
      <Avatar
        src={member.profile.avatar_url}
        name={member.profile.display_name}
        color={member.profile.color}
      />
      <ListItemText className={styles.name} aria-label="User details">
        <Text slot="headline" className={styles.displayName}>
          {member.profile.display_name}
        </Text>
        <Text slot="supporting" className={styles.email}>
          {member.profile.email}
        </Text>
      </ListItemText>
      {userId !== session?.user.id && permissions >= Permission.Admin ? (
        <Toolbar align="end" aria-label="Actions" className={styles.actions}>
          <DialogTrigger>
            <Switch
              isSelected={member.role === "admin"}
              isDisabled={
                permissions <
                (member.role === "admin" ? Permission.Owner : Permission.Admin)
              }
              color={member.profile.color}
              icon={({ isSelected }) =>
                isSelected && <Symbol>verified_user</Symbol>
              }
            >
              Admin
            </Switch>
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
              onConfirm={(close) => {
                updateMember({
                  org_id: orgId,
                  user_id: userId,
                  role: member.role === "admin" ? "member" : "admin",
                });
                close();
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
    </ListItem>
  );
}

export interface MemberListProps {
  orgId: number;
  memberIds: Array<string>;
}

export function MemberList({ orgId, memberIds }: MemberListProps) {
  return (
    <section className={styles.memberListGrid}>
      <Typography
        variant="headline5"
        className={styles.title}
        id="member-list-title"
      >
        Members
      </Typography>
      <div className={styles.memberListContainer}>
        <LineBackground opacity={0.2}>
          <List
            variant="two-line"
            aria-labelledby="member-list-title"
            className={styles.memberList}
            renderEmptyState={() => (
              <EmptyState
                size="large"
                title="No members"
                description="Invite members to collaborate on your projects."
              />
            )}
          >
            {memberIds.map((id) => (
              <MemberRow key={id} id={id} orgId={orgId} />
            ))}
          </List>
        </LineBackground>
      </div>
    </section>
  );
}
