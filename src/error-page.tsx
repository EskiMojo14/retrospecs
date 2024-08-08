import { EmptyState } from "~/components/empty";
import { Symbol } from "~/components/symbol";
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
      {message && <pre className={styles.error}>{message}</pre>}
    </main>
  );
}
