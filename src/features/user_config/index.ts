import type { Tables, TablesInsert } from "~/db/supabase";
import { createEndpointInjector } from "~/store/endpoint-injector";
import { supabaseQuery } from "~/util/supabase-query";

export type UserConfig = Tables<"user_config">;

export const injectUserConfigApi = createEndpointInjector(
  ({ supabase, api }) => ({
    api: api.enhanceEndpoints({ addTagTypes: ["UserConfig"] }).injectEndpoints({
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
        }),
      }),
      overrideExisting: true,
    }),
  }),
);
