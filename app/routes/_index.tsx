import type { MetaFunction } from "@remix-run/react";
import { injectOrgsApi, selectAllOrgs } from "~/features/orgs";
import { useEndpointInjector } from "~/hooks/use-endpoint-injector";
import { useHydratingLoaderData } from "~/hooks/use-hydrating-loader-data";
import { applyInjector } from "~/store/endpoint-injector";
import { createHydratingLoader } from "~/store/hydrate";
import { makeDisposable } from "~/util";

export const meta: MetaFunction = () => [
  { title: "RetroSpecs" },
  {
    name: "description",
    content: "View your organizations",
  },
];

export const loader = createHydratingLoader(
  async ({ context, context: { store } }) => {
    const { api: orgsApi } = applyInjector(injectOrgsApi, context);

    using promise = makeDisposable(
      store.dispatch(orgsApi.endpoints.getOrgs.initiate()),
    );

    return { data: await promise.unwrap() };
  },
);

export default function Orgs() {
  const { useGetOrgsQuery } = useEndpointInjector(injectOrgsApi);
  const { data: dataFromLoader } = useHydratingLoaderData<typeof loader>();
  const { orgs = [] } = useGetOrgsQuery(undefined, {
    selectFromResult: ({ data = dataFromLoader }) => ({
      orgs: selectAllOrgs(data),
    }),
  });
  console.log(orgs);
  return "";
}
