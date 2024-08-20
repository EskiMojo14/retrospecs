import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-aria-components";
import { LinkButton } from "~/components/button";
import { Card, CardActions, CardPrimaryAction } from "~/components/card";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { Divider } from "~/components/divider";
import { withNewDefault } from "~/components/generic";
import { Grid, GridCell } from "~/components/grid";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useSession } from "~/db/provider";
import type { Org } from "~/features/orgs";
import {
  deleteOrg,
  getOrgMemberCount,
  getOrgs,
  selectOrgById,
} from "~/features/orgs";
import { getDisplayName } from "~/features/profiles";
import { getTeamCountByOrg } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useCurrentUserPermissionsGetOrgs } from "~/hooks/use-user-permissions";
import { pluralize } from "~/util";
import { Permission } from "~/util/permissions";
import { EditOrg } from "./edit-org";
import styles from "./org-grid.module.scss";

interface OrgCardProps {
  orgId: Org["id"];
}

function OrgCard({ orgId }: OrgCardProps) {
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
  const { data: owner } = useQuery(
    useOptionsCreator(getDisplayName, org?.owner_id),
  );
  const permissions = useCurrentUserPermissionsGetOrgs(orgId);
  const { mutate: deleteOrgFn, isPending } = useMutation(
    useOptionsCreator(deleteOrg),
  );
  if (!org) return null;
  return (
    <Card
      as={GridCell}
      span="half"
      breakpoints={{
        phone: { span: "full" },
        "tablet-s": { span: "full" },
      }}
      className={styles.orgCard}
    >
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
        {owner && (
          <Typography variant="subtitle2" className={styles.owner}>
            Owned by {owner}
          </Typography>
        )}
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
                  isIndeterminate: isPending,
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

const H5GridCell = withNewDefault("H5GridCell", GridCell, "h5");

export function OrgGrid({ orgIds }: { orgIds: Array<number> }) {
  return (
    <Grid as="section">
      <Typography
        as={H5GridCell}
        span="full"
        variant="headline5"
        className={styles.heading}
      >
        Organisations ({orgIds.length})
      </Typography>
      {orgIds.map((orgId) => (
        <OrgCard key={orgId} orgId={orgId} />
      ))}
    </Grid>
  );
}
