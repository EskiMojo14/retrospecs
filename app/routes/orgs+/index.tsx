import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "RetroSpecs" }];
};

export const loader = () =>
  redirect("/", {
    status: 301,
  });
