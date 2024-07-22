import type { MetaFunction } from "@remix-run/react";
import { Text } from "react-aria-components";
import { AppBar } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { FloatingActionButton, LinkButton } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Logo } from "~/features/logo";
import { injectOrgsApi, selectAllOrgs } from "~/features/orgs";
import { PreferencesDialog } from "~/features/preferences";
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
  return (
    <main>
      <AppBar>
        <Toolbar slot="nav">
          <Logo />
          <Breadcrumbs>
            <Breadcrumb>
              <Link href="/">Organisations</Link>
            </Breadcrumb>
          </Breadcrumbs>
        </Toolbar>
        <Toolbar slot="actions">
          <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
            <Symbol>logout</Symbol>
          </IconButton>
          <PreferencesDialog />
        </Toolbar>
      </AppBar>
      <FloatingActionButton extended>
        <Symbol>add</Symbol>
        <Text slot="label">Create</Text>
      </FloatingActionButton>
    </main>
  );
}
