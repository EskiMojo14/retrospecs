import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-aria-components";
import { LinkButton } from "~/components/button";
import { Card, CardActions, CardPrimaryAction } from "~/components/card";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { Divider } from "~/components/divider";
import { Grid, GridCell } from "~/components/grid";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { useCurrentUserPermissions } from "~/hooks/use-user-permissions";
import { pluralize } from "~/util";
import { Permission } from "~/util/permissions";
import {
  deleteTeam,
  getTeamMemberCount,
  getTeamsByOrg,
  selectTeamById,
} from ".";
import styles from "./team-card.module.scss";

export interface TeamCardProps {
  orgId: number;
  teamId: number;
}

export function TeamCard({ orgId, teamId }: TeamCardProps) {
  const { data: team } = useQuery({
    ...useOptionsCreator(getTeamsByOrg, orgId),
    select: (data) => selectTeamById(data, teamId),
  });
  const { data: memberCount = 0 } = useQuery(
    useOptionsCreator(getTeamMemberCount, teamId),
  );
  const { mutate: deleteTeamFn, isPending } = useMutation(
    useOptionsCreator(deleteTeam),
  );
  const permissions = useCurrentUserPermissions(orgId);
  if (!team) return null;
  return (
    <Card as={GridCell} span={6} className={styles.teamCard}>
      <CardPrimaryAction
        as={Link}
        href={`/orgs/${orgId}/teams/${teamId}`}
        className={styles.primaryAction}
      >
        <Typography variant="headline6" className={styles.title}>
          {team.name}
        </Typography>
      </CardPrimaryAction>
      <Divider />
      <CardActions>
        <Toolbar slot="buttons">
          <LinkButton
            variant="outlined"
            href={`/orgs/${orgId}/teams/${teamId}/members`}
            slot="action"
          >
            <Symbol slot="leading">people</Symbol>
            {pluralize`${memberCount} ${[memberCount, "member"]}`}
          </LinkButton>
        </Toolbar>
        {permissions >= Permission.Admin && (
          <Toolbar slot="icons">
            <IconButton tooltip="Edit" slot="action">
              <Symbol>edit</Symbol>
            </IconButton>
            <ConfirmationDialog
              trigger={
                <IconButton tooltip="Delete" slot="action">
                  <Symbol>delete</Symbol>
                </IconButton>
              }
              title="Delete team"
              description={`Are you sure you want to delete ${team.name}?`}
              onConfirm={(close) => {
                deleteTeamFn(teamId, {
                  onSuccess: close,
                });
              }}
              confirmButtonProps={{
                isIndeterminate: isPending,
                color: "red",
              }}
            />
          </Toolbar>
        )}
      </CardActions>
    </Card>
  );
}

interface TeamGridProps {
  orgId: number;
  teamIds: Array<number>;
}

export function TeamGrid({ orgId, teamIds }: TeamGridProps) {
  return (
    <Grid>
      {teamIds.map((teamId) => (
        <TeamCard key={teamId} orgId={orgId} teamId={teamId} />
      ))}
    </Grid>
  );
}
