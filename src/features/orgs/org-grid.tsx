import { OrgCard } from "./org-card";
import styles from "./org-grid.module.scss";

export function OrgGrid({ orgIds }: { orgIds: Array<number> }) {
  return (
    <div className={styles.orgGrid}>
      {orgIds.map((orgId) => (
        <OrgCard key={orgId} orgId={orgId} />
      ))}
    </div>
  );
}
