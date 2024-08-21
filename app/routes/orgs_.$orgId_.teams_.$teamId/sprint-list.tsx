import { GridList } from "react-aria-components";
import { Grid, GridInner } from "~/components/grid";
import { Typography } from "~/components/typography";

export interface SprintListProps {
  sprintIds: Array<number>;
}

export function SprintList({ sprintIds }: SprintListProps) {
  return (
    <Grid>
      <GridInner>
        <Typography variant="headline5" id="sprint-list-title">
          Sprints
        </Typography>
      </GridInner>
      <GridInner as={GridList} aria-labelledby="sprint-list-title"></GridInner>
    </Grid>
  );
}
