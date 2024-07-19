import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// eslint-disable-next-line import/no-unresolved
import { routes } from "virtual:routes";
import { store } from "@/store.ts";
import "./index.scss";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback="Loading...">
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
