import { Link } from "~/components/link";
import { Heading, Typography } from "~/components/typography";
import styles from "./error-page.module.scss";

export function ForeEauFore() {
  return (
    <main className={styles.page}>
      <Heading variant="headline3" className={styles.title}>
        Not all who wander are lost.
      </Heading>
      <Typography variant="subtitle1" className={styles.subtitle}>
        But you probably are.
      </Typography>
      <Link href="/">Go back home</Link>
    </main>
  );
}
