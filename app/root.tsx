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
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { RouterProvider } from "react-aria-components";
import type { NavigateOptions } from "react-router-dom";
import { useDehydratedState } from "use-dehydrated-state";
import { ForeEauFore } from "~/404";
import { GlobalToastRegion } from "~/components/toast/toast-region";
import { ensureAuthenticated } from "~/db/auth.server";
import {
  SupabaseProvider,
  QueryClientProvider,
  SessionProvider,
} from "~/db/provider";
import { ErrorPage } from "~/error-page";
import type { UserConfig } from "~/features/user_config";
import { getUserConfig } from "~/features/user_config";
import "~/index.scss";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const noAuthRoutes = ["/sign-in", "/auth/callback"];

export const loader = (async ({
  request,
  context,
}): Promise<
  TypedResponse<{
    lang: string;
    config?: UserConfig | null;
  }>
> => {
  const { lang, headers, queryClient } = context;
  const url = new URL(request.url);
  const isNoAuthRoute = noAuthRoutes.some(
    (pathname) => url.pathname === pathname,
  );
  if (isNoAuthRoute) {
    return json({ lang }, { headers });
  }

  const user = await ensureAuthenticated(context);

  return json(
    {
      lang,
      config: await queryClient.ensureQueryData(
        getUserConfig(context, user.id),
      ),
      dehydratedState: dehydrate(queryClient),
    },
    { headers },
  );
}) satisfies LoaderFunction;

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, config } = useRouteLoaderData<typeof loader>("root") ?? {
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
            <SessionProvider>
              <QueryClientProvider>
                {children}
                <GlobalToastRegion aria-label="Notifications" />
              </QueryClientProvider>
            </SessionProvider>
          </SupabaseProvider>
        </RouterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const dehydratedState = useDehydratedState();
  return (
    <HydrationBoundary state={dehydratedState}>
      <Outlet />
    </HydrationBoundary>
  );
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
