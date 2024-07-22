import type { LoaderFunction } from "@remix-run/node";
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
import { StoreProvider } from "~/store/provider";
import "~/index.scss";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

const authRoutes = ["/sign-in", "/auth/callback"];

export const loader = (async ({ request, context }) => {
  const { lang, headers } = context;
  const url = new URL(request.url);
  const isAuthRoute = authRoutes.some((pathname) => url.pathname === pathname);
  if (isAuthRoute) {
    return json(lang, { headers });
  }
  await ensureAuthenticated(context);
  return json(lang, { headers });
}) satisfies LoaderFunction;

export function Layout({ children }: { children: React.ReactNode }) {
  const lang = useRouteLoaderData<typeof loader>("root");
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/retrospecs.png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();
  return (
    <RouterProvider {...{ useHref, navigate }}>
      <SupabaseProvider>
        <StoreProvider>
          <Outlet />
          <GlobalToastRegion />
        </StoreProvider>
      </SupabaseProvider>
    </RouterProvider>
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
