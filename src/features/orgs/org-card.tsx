import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-aria-components";
import { LinkButton } from "~/components/button";
import { Card, CardActions, CardPrimaryAction } from "~/components/card";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { Divider } from "~/components/divider";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useSession } from "~/db/provider";
import { getTeamCountByOrg } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import {
  Permission,
  useCurrentUserPermissions,
} from "~/hooks/use-user-permissions";
import { pluralize } from "~/util";
import { EditOrg } from "./edit-org";
import type { Org } from ".";
import { deleteOrg, getOrgMemberCount, getOrgs, selectOrgById } from ".";
import styles from "./org-card.module.scss";

interface OrgCardProps {
  orgId: Org["id"];
}

export function OrgCard({ orgId }: OrgCardProps) {
  const session = useSession();
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs, session?.user.id),
    select: (data) => selectOrgById(data, orgId),
  });
  const { data: memberCount = 0 } = useQuery(
    useOptionsCreator(getOrgMemberCount, orgId),
  );
  const { data: teamCount = 0 } = useQuery(
    useOptionsCreator(getTeamCountByOrg, orgId),
  );
  const permissions = useCurrentUserPermissions(orgId);
  const { mutate: deleteOrgFn, isPending } = useMutation(
    useOptionsCreator(deleteOrg),
  );
  if (!org) return null;
  return (
    <Card className={styles.orgCard}>
      <CardPrimaryAction
        as={Link}
        href={`/orgs/${orgId}`}
        className={styles.primaryAction}
      >
        <Typography variant="overline" className={styles.teamCount}>
          {pluralize`${teamCount} ${[teamCount, "team"]}`}
        </Typography>
        <Typography variant="headline6" className={styles.title}>
          {org.name}
        </Typography>
      </CardPrimaryAction>
      <Divider />
      <CardActions>
        <Toolbar slot="buttons">
          <LinkButton
            variant="outlined"
            href={`/orgs/${orgId}/members`}
            slot="action"
          >
            <Symbol slot="leading">group</Symbol>
            {pluralize`${memberCount} ${[memberCount, "member"]}`}
          </LinkButton>
        </Toolbar>
        {permissions >= Permission.Admin ? (
          <Toolbar slot="icons">
            <EditOrg
              orgId={orgId}
              trigger={
                <IconButton tooltip="Edit" slot="action">
                  <Symbol>edit</Symbol>
                </IconButton>
              }
            />
            {permissions >= Permission.Owner ? (
              <ConfirmationDialog
                trigger={
                  <IconButton tooltip="Delete" slot="action">
                    <Symbol>delete</Symbol>
                  </IconButton>
                }
                title="Delete organisation"
                description={`Are you sure you want to delete "${org.name}"?`}
                onConfirm={(close) => {
                  deleteOrgFn(orgId, {
                    onSuccess: close,
                  });
                }}
                confirmButtonProps={{
                  isDisabled: isPending,
                  color: "red",
                }}
              />
            ) : null}
          </Toolbar>
        ) : null}
      </CardActions>
    </Card>
  );
}
