import type { QueryClient } from "@tanstack/react-query";
import { skipToken } from "@tanstack/react-query";
import { toastQueue } from "~/components/toast";
import type { Enums, Tables, TablesInsert } from "~/db/supabase";
import { createEndpointInjector } from "~/store/endpoint-injector";
import {
  supabaseQuery,
  supabaseFn,
  supabaseQueryOptions,
  supabaseMutationOptions,
} from "~/util/supabase-query";

export type UserConfig = Tables<"user_config">;
export type Theme = Enums<"theme">;
export type Groove = Enums<"groove">;

export const injectUserConfigApi = createEndpointInjector(
  ({ supabase, api }) => {
    const userConfigApi = api
      .enhanceEndpoints({ addTagTypes: ["UserConfig"] })
      .injectEndpoints({
        endpoints: (build) => ({
          getUserConfig: build.query<UserConfig | null, string>({
            queryFn: supabaseQuery(
              (userId) =>
                supabase.from("user_config").select("*").eq("user_id", userId),
              {
                transformResponse: (response) => response[0] ?? null,
              },
            ),
            providesTags: ["UserConfig"],
          }),
          updateUserConfig: build.mutation<
            UserConfig,
            TablesInsert<"user_config">
          >({
            queryFn: supabaseQuery((update) =>
              supabase
                .from("user_config")
                .upsert(update)
                .eq("user_id", update.user_id)
                .single(),
            ),
            invalidatesTags: ["UserConfig"],
            onQueryStarted(update, { queryFulfilled, dispatch }) {
              const { undo } = dispatch(
                userConfigApi.util.updateQueryData(
                  "getUserConfig",
                  update.user_id,
                  (draft) => {
                    const { theme, groove } = update;
                    if (!draft) {
                      return {
                        user_id: update.user_id,
                        created_at: new Date().toISOString(),
                        theme: theme ?? null,
                        groove: groove ?? null,
                      };
                    }
                    if (theme) draft.theme = theme;
                    if (groove) draft.groove = groove;
                  },
                ),
              );
              queryFulfilled.catch(() => {
                toastQueue.add({
                  type: "error",
                  description: "Failed to update user config",
                });
                undo();
              });
            },
          }),
        }),
        overrideExisting: true,
      });
    return { api: userConfigApi };
  },
);

export const getUserConfigOptions = supabaseQueryOptions(
  (supabase, userId: string | undefined) => ({
    queryKey: ["userConfig", userId],
    queryFn: userId
      ? supabaseFn(
          () => supabase.from("user_config").select().eq("user_id", userId),
          (response) => response[0] ?? null,
        )
      : skipToken,
  }),
);

export const updateUserConfigOptions = supabaseMutationOptions(
  (supabase, queryClient: QueryClient) => ({
    mutationFn: supabaseFn((update: TablesInsert<"user_config">) =>
      supabase
        .from("user_config")
        .upsert(update)
        .eq("user_id", update.user_id)
        .single(),
    ),
    onMutate({ user_id, groove, theme }: TablesInsert<"user_config">) {
      queryClient.setQueryData(
        getUserConfigOptions(supabase, user_id).queryKey,
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
  }),
);
