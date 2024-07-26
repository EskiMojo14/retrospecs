import { createEntityAdapter } from "@reduxjs/toolkit";
import { toastQueue } from "~/components/toast";
import type { Tables, TablesUpdate } from "~/db/supabase";
import {
  supabaseFn,
  supabaseMutationOptions,
  supabaseQueryOptions,
} from "~/util/supabase-query";
import type { PickRequired } from "~/util/types";

export type Profile = Tables<"profiles">;

export const profileAdapter = createEntityAdapter({
  selectId: (profile: Profile) => profile.user_id,
  sortComparer: (a, b) => a.display_name.localeCompare(b.display_name),
});

export const getProfile = supabaseQueryOptions(({ supabase }, id: string) => ({
  queryKey: ["profile", id],
  queryFn: supabaseFn(() =>
    supabase.from("profiles").select("*").eq("user_id", id).single(),
  ),
}));

export const updateProfile = supabaseMutationOptions(({ supabase }) => ({
  mutationFn: supabaseFn(
    (update: PickRequired<TablesUpdate<"profiles">, "user_id">) =>
      supabase.from("profiles").update(update).eq("user_id", update.user_id),
  ),
  onError(err) {
    toastQueue.add({
      type: "error",
      title: "Failed to update profile",
      description: err.message,
    });
  },
}));
