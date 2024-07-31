import { redirect, type LoaderFunction } from "@vercel/remix";

export const loader: LoaderFunction = ({ params }) =>
  redirect(`/orgs/${params.orgId}`, {
    status: 301,
  });
