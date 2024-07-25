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
import { getTeamCountByOrg } from "~/features/teams";
import { useOptionsCreator } from "~/hooks/use-options-creator";
import {
  Permission,
  useCurrentUserPermissions,
} from "~/hooks/use-user-permissions";
import type { Org } from ".";
import { getOrgMemberCount, getOrgs, selectOrgById } from ".";
import styles from "./org-card.module.scss";

interface OrgCardProps {
  orgId: Org["id"];
}

export function OrgCard({ orgId }: OrgCardProps) {
  const { data: org } = useQuery({
    ...useOptionsCreator(getOrgs),
    select: (data) => selectOrgById(data, orgId),
  });
  const { data: memberCount } = useQuery(
    useOptionsCreator(getOrgMemberCount, orgId),
  );
  const { data: teamCount } = useQuery(
    useOptionsCreator(getTeamCountByOrg, orgId),
  );
  const permissions = useCurrentUserPermissions(orgId);
  if (!org) return null;
  return (
    <Card className={styles.orgCard}>
      <CardPrimaryAction
        as={Link}
        href={`/orgs/${orgId}`}
        className={styles.primaryAction}
      >
        <Typography variant="overline" className={styles.teamCount}>
          {teamCount} Teams
        </Typography>
        <Typography variant="headline6" className={styles.title}>
          {org.name}
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
        {permissions >= Permission.Admin ? (
          <Toolbar slot="icons">
            <CardActionIcon>
              <Symbol>edit</Symbol>
            </CardActionIcon>
            <CardActionIcon>
              <Symbol>delete</Symbol>
            </CardActionIcon>
          </Toolbar>
        ) : null}
      </CardActions>
    </Card>
  );
}
