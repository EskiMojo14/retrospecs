import { useMemo } from "react";
import {
  selectTeamById,
  useGetTeamMemberCountQuery,
  useGetTeamsByOrgQuery,
} from ".";
import { LinkButton } from "@/components/button";
import {
  Card,
  CardActionButton,
  CardActionButtons,
  CardActionIcon,
  CardActionIcons,
  CardActions,
  CardPrimaryAction,
} from "@/components/card";
import { Symbol } from "@/components/symbol";
import { Typography } from "@/components/typography";
import styles from "./team-card.module.scss";

export interface TeamCardProps {
  orgId: number;
  teamId: number;
}

export function TeamCard({ orgId, teamId }: TeamCardProps) {
  const { team } = useGetTeamsByOrgQuery(orgId, {
    selectFromResult: ({ data }) => ({
      team: data && selectTeamById(data, teamId),
    }),
  });
  const { memberCount } = useGetTeamMemberCountQuery(teamId, {
    selectFromResult: ({ data }) => ({ memberCount: data ?? 0 }),
  });
  const formattedDate = useMemo(
    () =>
      team?.created_at &&
      new Date(team.created_at).toLocaleDateString(undefined, {
        dateStyle: "short",
      }),
    [team?.created_at],
  );
  if (!team) return null;
  return (
    <Card className={styles.teamCard}>
      <CardPrimaryAction
        as={LinkButton}
        href={`/orgs/${orgId}/teams/${teamId}`}
        className={styles.primaryAction}
      >
        <Typography variant="headline6" className={styles.title}>
          {team.name}
        </Typography>
        <Typography variant="caption" className={styles.date}>
          Created {formattedDate}
        </Typography>
      </CardPrimaryAction>
      <CardActions>
        <CardActionButtons>
          <CardActionButton
            as={LinkButton}
            variant="outlined"
            href={`/orgs/${orgId}/teams/${teamId}/members`}
          >
            Members: {memberCount}
          </CardActionButton>
        </CardActionButtons>
        <CardActionIcons>
          <CardActionIcon>
            <Symbol>edit</Symbol>
          </CardActionIcon>
          <CardActionIcon>
            <Symbol>delete</Symbol>
          </CardActionIcon>
        </CardActionIcons>
      </CardActions>
    </Card>
  );
}
