import styles from "./card.module.scss";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../components/icon-button";
import { Checkbox } from "react-aria-components";

interface CardProps {
  message: string;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function Card({
  message,
  checked,
  onCheck,
  onEdit,
  onDelete,
}: CardProps) {
  return (
    <div className={styles.card}>
      <Checkbox
        className={clsx(styles.section, styles.text)}
        isSelected={checked}
        isReadOnly={!onCheck}
        onChange={onCheck}
      >
        <span className={styles.bg} aria-hidden />
        <span className={styles.content}>
          <span className={styles.title}>{message}</span>
        </span>
      </Checkbox>
      {(onEdit ?? onDelete) && (
        <div className={clsx(styles.section, styles.actions)}>
          <span className={styles.bg} aria-hidden />
          <span className={styles.content}>
            {onEdit && (
              <IconButton onPress={onEdit} aria-label="Edit message">
                <FontAwesomeIcon icon={faPen} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton onPress={onDelete} aria-label="Delete feedback">
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
