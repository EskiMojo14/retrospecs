import {
  redirect,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "RetroSpecs" },
    { name: "description", content: "Welcome to RetroSpecs!" },
  ];
};

export const loader: LoaderFunction = () => redirect("/orgs");

export default function Index() {
  return null;
}
