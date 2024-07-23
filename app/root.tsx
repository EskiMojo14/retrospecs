import type { LoaderFunction, TypedResponse } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useNavigate,
  useHref,
  json,
  useRouteLoaderData,
} from "@remix-run/react";
import { RouterProvider } from "react-aria-components";
import type { NavigateOptions } from "react-router-dom";
import { ForeEauFore } from "~/404";
import { GlobalToastRegion } from "~/components/toast/toast-region";
import { ensureAuthenticated } from "~/db/auth.server";
import { SupabaseProvider } from "~/db/provider";
import { ErrorPage } from "~/error-page";
import { HydrationBoundary } from "~/features/hydration";
import type { UserConfig } from "~/features/user_config";
import { injectUserConfigApi } from "~/features/user_config";
import type { RootState } from "~/store";
import { applyInjector } from "~/store/endpoint-injector";
import { StoreProvider } from "~/store/provider";
import { makeDisposable } from "~/util";
import "~/index.scss";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const authRoutes = ["/sign-in", "/auth/callback"];

export const loader = (async ({
  request,
  context,
}): Promise<
  TypedResponse<{
    lang: string;
    state?: RootState;
    config?: UserConfig | null;
  }>
> => {
  const { lang, headers, store } = context;
  const url = new URL(request.url);
  const isAuthRoute = authRoutes.some((pathname) => url.pathname === pathname);
  if (isAuthRoute) {
    return json({ lang }, { headers });
  }
  const user = await ensureAuthenticated(context);

  const { api: userConfigApi } = applyInjector(injectUserConfigApi, context);

  using promise = makeDisposable(
    store.dispatch(userConfigApi.endpoints.getUserConfig.initiate(user.id)),
  );

  return json(
    { lang, state: store.getState(), config: await promise.unwrap() },
    { headers },
  );
}) satisfies LoaderFunction;

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, state, config } = useRouteLoaderData<typeof loader>("root") ?? {
    lang: "en",
  };
  const navigate = useNavigate();
  return (
    <html lang={lang} data-groove={config?.groove} data-theme={config?.theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/retrospecs.png" />
        <Meta />
        <Links />
      </head>
      <body>
        <RouterProvider {...{ useHref, navigate }}>
          <SupabaseProvider>
            <StoreProvider>
              <HydrationBoundary state={state}>
                {children}
                <GlobalToastRegion />
              </HydrationBoundary>
            </StoreProvider>
          </SupabaseProvider>
        </RouterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  let status = undefined;
  let message = undefined;
  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = error.statusText;
  } else if (error instanceof Error) {
    message = error.message;
  }
  if (status === 404) return <ForeEauFore />;
  return <ErrorPage {...{ status, message }} />;
}
