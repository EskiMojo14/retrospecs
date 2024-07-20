import type { LoaderFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useNavigate,
  useHref,
} from "@remix-run/react";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { RouterProvider } from "react-aria-components";
import type { NavigateOptions } from "react-router-dom";
import { ForeEauFore } from "~/404";
import { ErrorPage } from "~/error-page";
import "~/index.scss";
declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export const loader = (({ request }) => {
  const [locale = ""] = parseAcceptLanguage(
    request.headers.get("accept-language") ?? "",
  );
  return { locale };
}) satisfies LoaderFunction;

export function Layout({ children }: { children: React.ReactNode }) {
  const { locale = "en" } = useLoaderData<typeof loader>();
  return (
    <html lang={locale}>
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
      <Outlet />
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
