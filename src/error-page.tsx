import { useRouteError } from "react-router-dom";
import { Heading, Typography } from "@/components/typography";
import styles from "./error-page.module.scss";

export function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const errorIsObject = error && typeof error === "object";

  let status = undefined;
  if (errorIsObject && "status" in error && typeof error.status === "number") {
    status = error.status;
  }
  let message = undefined;
  if (
    errorIsObject &&
    "statusText" in error &&
    typeof error.statusText === "string"
  ) {
    message = error.statusText;
  } else if (
    errorIsObject &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    message = error.message;
  }
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
