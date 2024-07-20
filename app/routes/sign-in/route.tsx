import { useActionData, useSearchParams, useSubmit } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { Form } from "react-aria-components";
import { Typography } from "~/components/typography";
import { GithubOAuthButton } from "~/features/auth/oauth";
import styles from "./route.module.scss";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { supabase } = context;
  const url = new URL(request.url);
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${url.origin}/auth/callback`,
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }
};

export default function SignIn() {
  const submit = useSubmit();

  const actionData = useActionData<typeof action>();

  const [searchParams] = useSearchParams();

  const errorMessages: Array<string> = [];

  if (searchParams.has("error")) {
    errorMessages.push(searchParams.get("error")!);
  }
  if (actionData?.error) {
    errorMessages.push(actionData.error);
  }

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        submit(e.currentTarget);
      }}
      className={styles.form}
    >
      <GithubOAuthButton type="submit" />
      {errorMessages.map((message) => (
        <Typography key={message} variant="body2" className={styles.error}>
          {message}
        </Typography>
      ))}
    </Form>
  );
}
