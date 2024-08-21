import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "~/components/empty";
import { Grid, GridCell, GridInner } from "~/components/grid";
import { List, ListItem, ListItemText } from "~/components/list";
import { Time, Typography } from "~/components/typography";
import { getSprintsForTeam, selectSprintById } from "~/features/sprints";
import { useOptionsCreator } from "~/hooks/use-options-creator";

interface SprintItem {
  teamId: number;
  id: number;
}

function SprintListItem({ teamId, id: sprintId }: SprintItem) {
  const { data: sprint } = useQuery({
    ...useOptionsCreator(getSprintsForTeam, teamId),
    select: (sprints) => selectSprintById(sprints, sprintId),
  });
  if (!sprint) return null;
  return (
    <ListItem textValue={sprint.name}>
      <ListItemText
        headline={sprint.name}
        overline={
          <Time dateTime={sprint.created_at}>
            {(date) =>
              date.toLocaleDateString(undefined, { dateStyle: "medium" })
            }
          </Time>
        }
      />
    </ListItem>
  );
}

export interface SprintListProps {
  teamId: number;
  sprintIds: Array<number>;
}

export function SprintList({ teamId, sprintIds }: SprintListProps) {
  return (
    <Grid as="section">
      <GridInner>
        <GridCell as="header" span="full">
          <Typography variant="headline5" id="sprint-list-title">
            Sprints ({sprintIds.length})
          </Typography>
          <List
            variant="two-line"
            aria-labelledby="sprint-list-title"
            renderEmptyState={() => (
              <EmptyState
                title="No sprints"
                description="Create a sprint to get started"
              />
            )}
          >
            {sprintIds.map((sprintId) => (
              <SprintListItem key={sprintId} teamId={teamId} id={sprintId} />
            ))}
          </List>
        </GridCell>
      </GridInner>
    </Grid>
  );
}
