import { useMemo } from "react";
import { LinkButton } from "@/components/button";
import {
  Card,
  CardActionButton,
  CardActionIcon,
  CardActions,
  CardPrimaryAction,
} from "@/components/card";
import { Symbol } from "@/components/symbol";
import { Toolbar } from "@/components/toolbar";
import { Typography } from "@/components/typography";
import { useGetTeamCountByOrgQuery } from "@/features/teams";
import type { Org } from ".";
import { selectOrgById, useGetOrgMemberCountQuery, useGetOrgsQuery } from ".";
import styles from "./org-card.module.scss";

interface OrgCardProps {
  orgId: Org["id"];
}

export function OrgCard({ orgId }: OrgCardProps) {
  const { org } = useGetOrgsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      org: data && selectOrgById(data, orgId),
    }),
  });
  const { memberCount } = useGetOrgMemberCountQuery(orgId, {
    selectFromResult: ({ data }) => ({ memberCount: data ?? 0 }),
  });
  const { teamCount } = useGetTeamCountByOrgQuery(orgId, {
    selectFromResult: ({ data }) => ({ teamCount: data ?? 0 }),
  });
  const formattedDate = useMemo(
    () =>
      org?.created_at &&
      new Date(org.created_at).toLocaleDateString(undefined, {
        dateStyle: "short",
      }),
    [org?.created_at],
  );
  if (!org) return null;
  return (
    <Card className={styles.orgCard}>
      <CardPrimaryAction
        as={LinkButton}
        href={`/orgs/${orgId}`}
        className={styles.primaryAction}
      >
        <Typography variant="overline" className={styles.teamCount}>
          {teamCount} Teams
        </Typography>
        <Typography variant="headline6" className={styles.title}>
          {org.name}
        </Typography>
        <Typography variant="caption" className={styles.date}>
          Created {formattedDate}
        </Typography>
      </CardPrimaryAction>
      <CardActions>
        <Toolbar slot="buttons">
          <CardActionButton
            as={LinkButton}
            variant="outlined"
            href={`/orgs/${orgId}/members`}
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
