import { useQuery } from "@tanstack/react-query";
import { Link } from "react-aria-components";
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
import { useOptionsCreator } from "~/hooks/use-options-creator";
import { pluralize } from "~/util";
import { getTeamMemberCount, getTeamsByOrg, selectTeamById } from ".";
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
  if (!team) return null;
  return (
    <Card className={styles.teamCard}>
      <CardPrimaryAction
        as={Link}
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
            <Symbol slot="leading">people</Symbol>
            {pluralize`${memberCount} ${[memberCount, "member"]}`}
          </CardActionButton>
        </Toolbar>
        <Toolbar slot="icons">
          <CardActionIcon tooltip="Edit">
            <Symbol>edit</Symbol>
          </CardActionIcon>
          <CardActionIcon tooltip="Delete">
            <Symbol>delete</Symbol>
          </CardActionIcon>
        </Toolbar>
      </CardActions>
    </Card>
  );
}
