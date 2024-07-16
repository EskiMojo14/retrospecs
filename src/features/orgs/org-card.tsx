import { useMemo } from "react";
import type { Org } from ".";
import { selectOrgById, useGetOrgMemberCountQuery, useGetOrgsQuery } from ".";
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

interface OrgCardProps {
  orgId: Org["id"];
}

export function OrgCard({ orgId }: OrgCardProps) {
  const { org } = useGetOrgsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      org: data && selectOrgById(data, orgId),
    }),
  });
  const { count } = useGetOrgMemberCountQuery(orgId, {
    selectFromResult: ({ data }) => ({ count: data ?? 0 }),
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
    <Card>
      <CardPrimaryAction>
        <Typography variant="headline6">{org.name}</Typography>
        <Typography variant="caption">Created {formattedDate}</Typography>
      </CardPrimaryAction>
      <CardActions>
        <CardActionButtons>
          <CardActionButton>Members ({count})</CardActionButton>
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
