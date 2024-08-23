import { LineBackground } from "~/components/line-background";
import { Heading } from "~/components/typography";
import styles from "./actions-list.module.scss";

export function ActionList() {
  return (
    <div className={styles.list}>
      <LineBackground>
        <header>
          <Heading variant="headline6">Actions</Heading>
        </header>
      </LineBackground>
    </div>
  );
}
