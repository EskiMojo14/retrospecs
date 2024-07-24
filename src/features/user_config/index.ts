import { skipToken } from "@tanstack/react-query";
import type { Enums, Tables, TablesInsert } from "~/db/supabase";
import {
  supabaseFn,
  supabaseQueryOptions,
  supabaseMutationOptions,
} from "~/util/supabase-query";

export type UserConfig = Tables<"user_config">;
export type Theme = Enums<"theme">;
export type Groove = Enums<"groove">;

export const configApi = {
  getUserConfig: supabaseQueryOptions(
    ({ supabase }, userId: string | undefined) => ({
      queryKey: ["userConfig", userId],
      queryFn: userId
        ? supabaseFn(
            () => supabase.from("user_config").select().eq("user_id", userId),
            (response) => response[0] ?? null,
          )
        : skipToken,
    }),
  ),
  updateUserConfig: supabaseMutationOptions(({ supabase, queryClient }) => ({
    mutationFn: supabaseFn((update: TablesInsert<"user_config">) =>
      supabase
        .from("user_config")
        .upsert(update)
        .eq("user_id", update.user_id)
        .single(),
    ),
    onMutate({ user_id, groove, theme }: TablesInsert<"user_config">) {
      queryClient.setQueryData(
        configApi.getUserConfig({ supabase, queryClient }, user_id).queryKey,
        (prevConfig) => {
          const res: UserConfig = {
            user_id,
            created_at: new Date().toISOString(),
            theme: null,
            groove: null,
            ...prevConfig,
          };
          if (theme) res.theme = theme;
          if (groove) res.groove = groove;
          return res;
        },
      );
      if (typeof document === "undefined") return;
      if (theme) document.documentElement.dataset.theme = theme;
      if (groove) document.documentElement.dataset.groove = groove;
    },
  })),
};
