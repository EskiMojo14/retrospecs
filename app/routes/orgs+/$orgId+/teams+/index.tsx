import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = ({ params }) =>
  redirect(`/orgs/${params.orgId}`, {
    status: 301,
  });
