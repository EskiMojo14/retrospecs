import {
  createServerClient as createClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { Request as ExpressRequest } from "express";
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from "~/env";
import type { Database } from "./supabase";

export const createServerClient = (request: Request | ExpressRequest) => {
  const headers = new Headers();

  const supabase = createClient<Database>(
    VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookie =
            request.headers instanceof Headers
              ? request.headers.get("cookie")
              : request.headers.cookie;
          return parseCookieHeader(cookie ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            );
          });
        },
      },
    },
  );

  return { supabase, headers };
};
