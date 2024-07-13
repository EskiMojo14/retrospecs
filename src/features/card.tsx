import { ReactNode, useState } from "react";
import styles from "./card.module.scss";
import clsx from "clsx";
import { Checkbox } from "../components/checkbox";
import { Button } from "react-aria-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

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
          {children}
        </span>
      </label>
      <div className={clsx(styles.section, styles.actions)}>
        <span className={styles.bg} />
        <span className={styles.content}>
          <Button>
            <FontAwesomeIcon icon={faPen} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </span>
      </div>
    </div>
  );
}
