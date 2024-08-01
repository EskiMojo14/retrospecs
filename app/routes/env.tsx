import { useLoaderData } from "@remix-run/react";

export const loader = () => import.meta.env;

export default function Env() {
  const env = useLoaderData<typeof loader>();
  return (
    <>
      <pre>{JSON.stringify(env, null, 2)}</pre>
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
    </>
  );
}
