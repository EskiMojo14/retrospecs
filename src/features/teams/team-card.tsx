import { useQuery } from "@tanstack/react-query";
import { LinkButton } from "~/components/button";
import {
  Card,
  CardActionButton,
  CardActionIcon,
  CardActions,
  CardPrimaryAction,
} from "~/components/card";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useOptionsCreator } from "~/hooks/use-query-options";
import { selectTeamById, teamsApi } from ".";
import styles from "./team-card.module.scss";

export interface TeamCardProps {
  orgId: number;
  teamId: number;
}

export function TeamCard({ orgId, teamId }: TeamCardProps) {
  const { data: team } = useQuery({
    ...useOptionsCreator(teamsApi.getTeamsByOrg, orgId),
    select: (data) => selectTeamById(data, teamId),
  });
  const { data: memberCount = 0 } = useQuery(
    useOptionsCreator(teamsApi.getTeamMemberCount, teamId),
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
      </CardPrimaryAction>
      <CardActions>
        <Toolbar slot="buttons">
          <CardActionButton
            as={LinkButton}
            variant="outlined"
            href={`/orgs/${orgId}/teams/${teamId}/members`}
          >
            Members: {memberCount}
          </CardActionButton>
        </Toolbar>
        <Toolbar slot="icons">
          <CardActionIcon>
            <Symbol>edit</Symbol>
          </CardActionIcon>
          <CardActionIcon>
            <Symbol>delete</Symbol>
          </CardActionIcon>
        </Toolbar>
      </CardActions>
    </Card>
  );
}
