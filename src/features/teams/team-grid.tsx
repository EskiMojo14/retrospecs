import { TeamCard } from "./team-card";
import styles from "./team-grid.module.scss";

interface TeamGridProps {
  orgId: number;
  teamIds: Array<number>;
}

export function TeamGrid({ orgId, teamIds }: TeamGridProps) {
  return (
    <div className={styles.teamGrid}>
      {teamIds.map((teamId) => (
        <TeamCard key={teamId} orgId={orgId} teamId={teamId} />
      ))}
    </div>
  );
}
