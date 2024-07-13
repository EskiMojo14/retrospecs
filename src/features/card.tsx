import { ReactNode, useState } from "react";
import styles from "./card.module.scss";
import clsx from "clsx";
import { Checkbox } from "../components/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "../components/icon-button";

interface CardProps {
  children: ReactNode;
}

export function Card({ children }: CardProps) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={styles.card}>
      <label
        className={clsx(styles.section, styles.text, checked && styles.checked)}
      >
        <span className={styles.bg} />
        <span className={styles.content}>
          <Checkbox isSelected={checked} onChange={setChecked} />
          <span className={styles.title}>{children}</span>
        </span>
      </label>
      <div className={clsx(styles.section, styles.actions)}>
        <span className={styles.bg} />
        <span className={styles.content}>
          <IconButton>
            <FontAwesomeIcon icon={faPen} />
          </IconButton>
          <IconButton>
            <FontAwesomeIcon icon={faTrash} />
          </IconButton>
        </span>
      </div>
    </div>
  );
}
