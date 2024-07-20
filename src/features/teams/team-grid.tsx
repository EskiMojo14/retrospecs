import { useEndpointInjector } from "~/hooks/use-endpoint-injector";
import { TeamCard } from "./team-card";
import { injectTeamsApi, selectTeamIds } from ".";
import styles from "./team-grid.module.scss";

interface TeamGridProps {
  orgId: number;
}

export function TeamGrid({ orgId }: TeamGridProps) {
  const { useGetTeamsByOrgQuery } = useEndpointInjector(injectTeamsApi);
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
