import { useMemo } from "react";
import type { Org } from ".";
import { selectOrgById, useGetOrgMemberCountQuery, useGetOrgsQuery } from ".";
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
import { useGetTeamCountByOrgQuery } from "@/features/teams";
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
        href={`/orgs/${org.id}`}
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
        <CardActionButtons>
          <CardActionButton
            as={LinkButton}
            variant="outlined"
            href={`/orgs/${org.id}/members`}
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
