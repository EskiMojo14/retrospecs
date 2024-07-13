import styles from "./card.module.scss";
import clsx from "clsx";
import { Checkbox } from "react-aria-components";
import { ReactNode } from "react";
import { Card } from "../../components/card";

interface FeedbackCardProps {
  children: ReactNode;
  actions?: ReactNode;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  checkable?: boolean;
}

export function FeedbackCard({
  children,
  actions,
  checked,
  onCheck,
  checkable = !!onCheck,
}: FeedbackCardProps) {
  return (
    <div className={styles.feedbackCard}>
      {checkable ? (
        <Card
          as={Checkbox}
          className={clsx(styles.section, styles.text, styles.checkbox)}
          isSelected={checked}
          isReadOnly={!onCheck}
          onChange={onCheck}
        >
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>{children}</span>
        </Card>
      ) : (
        <Card className={clsx(styles.section, styles.text)}>
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>
            <span className={styles.title}>{children}</span>
          </span>
        </Card>
      )}
      {actions && (
        <Card className={clsx(styles.section, styles.actions)}>
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>{actions}</span>
        </Card>
      )}
    </div>
  );
}
