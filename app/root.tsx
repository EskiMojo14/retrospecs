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
import type { DehydratedState } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-aria-components";
import type { NavigateOptions } from "react-router-dom";
import { useDehydratedState } from "use-dehydrated-state";
import { ForeEauFore } from "~/404";
import { GlobalToastRegion } from "~/components/toast/toast-region";
import { ensureAuthenticated } from "~/db/auth.server";
import { createLoader } from "~/db/loader.server";
import {
  SupabaseProvider,
  QueryClientProvider,
  SessionProvider,
} from "~/db/provider";
import { ErrorPage } from "~/error-page";
import type { Profile } from "~/features/profiles";
import { getProfile } from "~/features/profiles";
import type { UserConfig } from "~/features/user_config";
import { getUserConfig } from "~/features/user_config";
import { promiseOwnProperties } from "~/util";
import "~/index.scss";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const noAuthRoutes = ["/sign-in", "/auth/callback"];

export const loader = createLoader<{
  lang: string;
  config?: UserConfig | null;
  profile?: Profile;
  dehydratedState?: DehydratedState;
}>(async ({ request, context, context: { lang, headers, queryClient } }) => {
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
      ...(await promiseOwnProperties({
        profile: queryClient.ensureQueryData(getProfile(context, user.id)),
        config: queryClient.ensureQueryData(getUserConfig(context, user.id)),
      })),
      dehydratedState: dehydrate(queryClient),
    },
    { headers },
  );
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang = "en", config } =
    useRouteLoaderData<typeof loader>("root") ?? {};
  const navigate = useNavigate();
  const locale = new Intl.Locale(lang);

  return (
    <html
      lang={lang}
      dir={locale.getTextInfo?.().direction ?? locale.textInfo?.direction}
      data-groove={config?.groove ?? "heavy"}
      data-theme={config?.theme ?? "system"}
    >
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
                <ReactQueryDevtools initialIsOpen={false} />
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
