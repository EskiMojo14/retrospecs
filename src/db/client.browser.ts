import { createBrowserClient } from "@supabase/ssr";
import { VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL } from "~/env";
import type { Database } from "./supabase";

export const createClient = () =>
  createBrowserClient<Database>(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
