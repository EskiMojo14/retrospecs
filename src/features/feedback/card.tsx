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
}

export function FeedbackCard({
  children,
  actions,
  checked,
  onCheck,
}: FeedbackCardProps) {
  return (
    <div className={styles.feedbackCard}>
      <Card
        as={Checkbox}
        className={clsx(styles.section, styles.text, styles.checkbox)}
        isSelected={checked}
        isReadOnly={!onCheck}
        onChange={onCheck}
      >
        {children}
      </Card>
      {actions && (
        <Card className={clsx(styles.section, styles.actions)}>{actions}</Card>
      )}
    </div>
  );
}
