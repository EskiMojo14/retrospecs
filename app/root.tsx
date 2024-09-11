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
  useRouteLoaderData,
  json,
} from "@remix-run/react";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";
import type { NavigateOptions } from "react-router-dom";
import { useDehydratedState } from "use-dehydrated-state";
import { ForeEauFore } from "~/404";
import { BreakpointDisplay } from "~/components/grid";
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
import { promiseOwnProperties } from "~/util/ponyfills";
import "~/index.scss";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const noAuthRoutes = ["/sign-in", "/auth/callback"];

type LoaderResponse = {
  lang: string;
  config?: UserConfig | null;
  profile?: Profile;
  dehydratedState?: DehydratedState;
};

export const loader = createLoader(
  async ({ request, context, context: { lang, headers, queryClient } }) => {
    const url = new URL(request.url);
    const isNoAuthRoute = noAuthRoutes.some(
      (pathname) => url.pathname === pathname,
    );
    if (isNoAuthRoute) {
      return json<LoaderResponse>({
        lang,
        dehydratedState: dehydrate(queryClient),
      });
    }

    const user = await ensureAuthenticated(context);

    return json<LoaderResponse>(
      {
        lang,
        ...(await promiseOwnProperties({
          profile: queryClient.ensureQueryData(getProfile(context, user.id)),
          config: queryClient.ensureQueryData(getUserConfig(context, user.id)),
        })),
        dehydratedState: dehydrate(queryClient),
      },
      {
        headers,
      },
    );
  },
);

export function Layout({ children }: { children: ReactNode }) {
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
                <ReactQueryDevtools
                  buttonPosition="bottom-left"
                  initialIsOpen={false}
                />
                <BreakpointDisplay />
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
