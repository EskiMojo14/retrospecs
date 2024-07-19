import type { LoaderFunction } from "react-router-dom";
import { redirect } from "react-router-dom";
import { ErrorPage } from "@/error-page";

export const loader: LoaderFunction = () => redirect("/orgs");

export function Component() {
  return null;
}

export const errorElement = <ErrorPage />;
