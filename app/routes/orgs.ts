import { redirect } from "@vercel/remix";

export const loader = () =>
  redirect("/", {
    status: 301,
  });
