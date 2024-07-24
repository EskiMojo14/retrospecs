import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  useEffect,
  type ComponentType,
  type DependencyList,
  type EffectCallback,
} from "react";
import { Provider } from "react-redux";
import type { AppSupabaseClient } from "~/db";
import { OriginalSupabaseProvider } from "~/db/provider";
import type { BaseApi } from "~/features/api";
import { makeApi } from "~/features/api";
import type { AppStore, PreloadedState } from "~/store";
import { makeStore } from "~/store";
import { ApiProvider } from "~/store/provider";

type Decorator<
  ArgsConstraint extends {} = {},
  StoryProps extends keyof ArgsConstraint = never,
> = <TArgs extends ArgsConstraint>(
  Story: ComponentType<Omit<TArgs, StoryProps>>,
  context: { args: TArgs },
) => JSX.Element;

export const createSupabaseDecorator =
  (supabase: AppSupabaseClient): Decorator =>
  // eslint-disable-next-line react/display-name
  (Story, { args }) => (
    <OriginalSupabaseProvider supabase={supabase}>
      <Story {...args} />
    </OriginalSupabaseProvider>
  );

export const createQueryClientDecorator =
  (queryClient: QueryClient): Decorator =>
  // eslint-disable-next-line react/display-name
  (Story, { args }) => (
    <QueryClientProvider client={queryClient}>
      <Story {...args} />
    </QueryClientProvider>
  );

interface ReduxDecoratorConfig {
  preloadedState?: PreloadedState;
  store?: AppStore;
  api?: BaseApi;
}

export const createReduxDecorator =
  ({
    preloadedState,
    store = makeStore({ preloadedState }),
    api = makeApi(),
  }: ReduxDecoratorConfig): Decorator =>
  // eslint-disable-next-line react/display-name
  (Story, { args }) => (
    <ApiProvider api={api}>
      <Provider store={store}>
        <Story {...args} />
      </Provider>
    </ApiProvider>
  );

function Effect({
  children,
  effect,
  deps,
}: {
  children: JSX.Element;
  deps: DependencyList;
  effect: EffectCallback;
}) {
  useEffect(effect, [...deps, effect]);
  return children;
}

export interface DarkThemeDecoratorArgs {
  dark?: boolean;
}

export const darkThemeDecorator: Decorator<
  DarkThemeDecoratorArgs,
  keyof DarkThemeDecoratorArgs
> = (Story, { args: { dark, ...args } }) => (
  <Effect
    deps={[dark]}
    effect={() => {
      const originalTheme = document.documentElement.dataset.theme;
      document.documentElement.dataset.theme = dark ? "dark" : "light";
      return () => {
        document.documentElement.dataset.theme = originalTheme;
      };
    }}
  >
    <Story {...args} />
  </Effect>
);

export interface RtlDecoratorArgs {
  dir?: "rtl" | "ltr";
}

export const rtlDecorator: Decorator<
  RtlDecoratorArgs,
  keyof RtlDecoratorArgs
> = (Story, { args: { dir, ...args } }) => (
  <Effect
    deps={[dir]}
    effect={() => {
      const originalDir = document.documentElement.dir;
      document.documentElement.dir = dir ?? "ltr";
      return () => {
        document.documentElement.dir = originalDir;
      };
    }}
  >
    <Story {...args} />
  </Effect>
);
