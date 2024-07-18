import { TeamCard } from "./team-card";
import { selectTeamIds, useGetTeamsByOrgQuery } from ".";
import styles from "./team-grid.module.scss";

interface TeamGridProps {
  orgId: number;
}

export function TeamGrid({ orgId }: TeamGridProps) {
  const { teamIds = [] } = useGetTeamsByOrgQuery(orgId, {
    selectFromResult: ({ data }) => ({
      teamIds: data && selectTeamIds(data),
    }),
  });
  return (
    <div className={styles.orgGrid}>
      {teamIds.map((teamId) => (
        <TeamCard key={teamId} orgId={orgId} teamId={teamId} />
      ))}
    </div>
  );
}
