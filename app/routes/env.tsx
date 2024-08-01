import { useLoaderData } from "@remix-run/react";

export const loader = () => process.env;

export default function Env() {
  const env = useLoaderData<typeof loader>();
  const clientEnv = process.env;
  const importMetaEnv = import.meta.env;
  return (
    <>
      <pre>{JSON.stringify(env, null, 2)}</pre>
      <pre>{JSON.stringify(clientEnv, null, 2)}</pre>
      <pre>{JSON.stringify(importMetaEnv, null, 2)}</pre>
    </>
  );
}
