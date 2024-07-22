import { useLoaderData, type MetaFunction } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { injectOrgsApi } from "~/features/orgs";
import { applyInjector } from "~/store/endpoint-injector";
import { makeDisposable } from "~/util";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = (async ({ context, context: { store } }) => {
  const { api: orgsApi } = applyInjector(injectOrgsApi, context);

  using promise = makeDisposable(
    store.dispatch(orgsApi.endpoints.getOrgs.initiate()),
  );

  return { data: await promise.unwrap() };
}) satisfies LoaderFunction;

export default function Orgs() {
  const { data } = useLoaderData<typeof loader>();
  console.log(data);
  return "";
}
