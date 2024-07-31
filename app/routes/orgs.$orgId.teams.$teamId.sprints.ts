import { redirect, type LoaderFunction } from "@vercel/remix";

export const loader: LoaderFunction = ({ params }) =>
  redirect(`/orgs/${params.orgId}/teams/${params.teamId}`, {
    status: 301,
  });

export default () => null;
