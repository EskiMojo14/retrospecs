import { GridList } from "react-aria-components";
import { Grid, GridCell, GridInner } from "~/components/grid";
import { Typography } from "~/components/typography";

export interface SprintListProps {
  teamId: number;
  sprintIds: Array<number>;
}

export function SprintList({ sprintIds }: SprintListProps) {
  return (
    <Grid>
      <GridInner>
        <GridCell as="header" span="full">
          <Typography variant="headline5" id="sprint-list-title">
            Sprints ({sprintIds.length})
          </Typography>
        </GridCell>
      </GridInner>
      <GridInner as={GridList} aria-labelledby="sprint-list-title"></GridInner>
    </Grid>
  );
}
