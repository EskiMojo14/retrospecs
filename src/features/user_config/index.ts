import { toastQueue } from "~/components/toast";
import type { Tables, TablesInsert } from "~/db/supabase";
import { createEndpointInjector } from "~/store/endpoint-injector";
import { supabaseQuery } from "~/util/supabase-query";

export type UserConfig = Tables<"user_config">;

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
