import { OrgCard } from "./org-card";
import { selectOrgIds, useGetOrgsQuery } from ".";
import styles from "./org-grid.module.scss";

export function OrgGrid() {
  const { orgIds = [] } = useGetOrgsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      orgIds: data && selectOrgIds(data),
    }),
  });
  return (
    <div className={styles.orgGrid}>
      {orgIds.map((orgId) => (
        <OrgCard key={orgId} orgId={orgId} />
      ))}
    </div>
  );
}
