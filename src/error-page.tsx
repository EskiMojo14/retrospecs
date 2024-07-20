import { Heading, Typography } from "~/components/typography";
import { ForeEauFore } from "./404";
import styles from "./error-page.module.scss";

export interface ErrorPageProps {
  status?: number;
  message?: string;
}

export function ErrorPage({ status, message }: ErrorPageProps) {
  if (status === 404) return <ForeEauFore />;
  return (
    <main className={styles.page}>
      <Heading variant="headline3" className={styles.title}>
        Error {status}
      </Heading>
      <Typography variant="subtitle1" className={styles.subtitle}>
        Sorry, an unexpected error has occurred.
      </Typography>
      {message && <pre className={styles.error}>{message}</pre>}
    </main>
  );
}
