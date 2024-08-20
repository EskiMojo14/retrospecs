import type { MetaFunction } from "@remix-run/react";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { Form } from "react-aria-components";
import { AppBar, AppBarRow } from "~/components/app-bar";
import { Button } from "~/components/button";
import { LineBackground } from "~/components/line-background";
import { Symbol } from "~/components/symbol";
import { toastQueue } from "~/components/toast";
import { Toolbar } from "~/components/toolbar";
import { useSupabase } from "~/db/provider";
import { Logo } from "~/features/logo";
import SvgGithub from "~/icons/github";
import styles from "./route.module.scss";

export const meta: MetaFunction = () => [{ title: "RetroSpecs - Sign in" }];

const getURL = () => {
  if (typeof process === "undefined") return "http://localhost:5173/";
  let url =
    process.env.SITE_URL ??
    process.env.VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:5173/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

export const loader = () => ({
  url: getURL(),
});

export default function SignIn() {
  const { url } = useLoaderData<typeof loader>();
  const supabase = useSupabase();
  const [searchParams, setSearchParams] = useSearchParams();

  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const toastKeyRef = useRef<string>();

  useEffect(() => {
    if ((error ?? errorDescription) && !toastKeyRef.current) {
      toastKeyRef.current = toastQueue.add(
        {
          type: "error",
          title: error,
          description: errorDescription,
        },
        {
          onClose: () => {
            toastKeyRef.current = undefined;
          },
        },
      );
      setSearchParams(
        (prev) => {
          const searchParams = new URLSearchParams(prev);
          searchParams.delete("error");
          searchParams.delete("error_description");
          return searchParams;
        },
        { replace: true },
      );
    }
  }, [error, errorDescription, setSearchParams]);

  return (
    <LineBackground
      opacity={0.5}
      contentProps={{
        className: styles.content,
      }}
    >
      <AppBar>
        <AppBarRow>
          <Toolbar slot="nav">
            <Logo />
          </Toolbar>
        </AppBarRow>
      </AppBar>
      <Form className={styles.form}>
        <Button
          variant="elevated"
          onPress={() => {
            void supabase.auth.signInWithOAuth({
              provider: "github",
              options: {
                redirectTo: `${url}auth/callback`,
              },
            });
          }}
        >
          <Symbol slot="leading">
            <SvgGithub height={16} width={16} />
          </Symbol>
          Sign in with GitHub
        </Button>
      </Form>
    </LineBackground>
  );
}
