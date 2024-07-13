import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";
import { assert } from "@/util";

assert(
  typeof import.meta.env.VITE_SUPABASE_URL === "string",
  "Missing SUPABASE_URL",
);
assert(
  typeof import.meta.env.VITE_SUPABASE_KEY === "string",
  "Missing SUPABASE_KEY",
);

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
);
