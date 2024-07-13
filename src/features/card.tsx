import styles from "./card.module.scss";
import clsx from "clsx";
import { Checkbox } from "react-aria-components";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  actions?: ReactNode;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  checkable?: boolean;
}

export function Card({
  children,
  actions,
  checked,
  onCheck,
  checkable = !!onCheck,
}: CardProps) {
  return (
    <div className={styles.card}>
      {checkable ? (
        <Checkbox
          className={clsx(styles.section, styles.text, styles.checkbox)}
          isSelected={checked}
          isReadOnly={!onCheck}
          onChange={onCheck}
        >
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>{children}</span>
        </Checkbox>
      ) : (
        <div className={clsx(styles.section, styles.text)}>
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>
            <span className={styles.title}>{children}</span>
          </span>
        </div>
      )}
      {actions && (
        <div className={clsx(styles.section, styles.actions)}>
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>{actions}</span>
        </div>
      )}
    </div>
  );
}
