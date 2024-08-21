import { EmptyState } from "~/components/empty";
import { Symbol } from "~/components/symbol";
import { Typography } from "./components/typography";
import styles from "./error-page.module.scss";

export interface ErrorPageProps {
  status?: number;
  message?: string;
}

export function ErrorPage({ status, message }: ErrorPageProps) {
  return (
    <main className={styles.page}>
      <EmptyState
        icon={<Symbol>error</Symbol>}
        title={status ? `Error ${status}` : "Oops!"}
        description="Sorry, an unexpected error has occurred."
        size="x-large"
      />
      {message && (
        <Typography variant="body2" as="pre" className={styles.error}>
          {message}
        </Typography>
      )}
    </main>
  );
}
