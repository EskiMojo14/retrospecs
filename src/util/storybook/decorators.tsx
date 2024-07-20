import type { ComponentType } from "react";
import { Provider } from "react-redux";
import type { AppSupabaseClient } from "~/db";
import { OriginalSupabaseProvider } from "~/db/provider";
import type { AppStore, PreloadedState } from "~/store";
import { makeStore } from "~/store";

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

interface ReduxDecoratorConfig {
  preloadedState?: PreloadedState;
  store?: AppStore;
}

export const createReduxDecorator =
  ({
    preloadedState,
    store = makeStore(preloadedState),
  }: ReduxDecoratorConfig): Decorator =>
  // eslint-disable-next-line react/display-name
  (Story, { args }) => (
    <Provider store={store}>
      <Story {...args} />
    </Provider>
  );

export interface DarkThemeDecoratorArgs {
  dark?: boolean;
}

export const darkThemeDecorator: Decorator<
  DarkThemeDecoratorArgs,
  keyof DarkThemeDecoratorArgs
> = (Story, { args: { dark, ...args } }) => (
  <div
    data-theme={dark ? "dark" : "light"}
    style={{
      padding: "1rem",
      background: dark ? "var(--brown-800)" : undefined,
      color: dark ? "var(--white)" : undefined,
    }}
  >
    <Story {...args} />
  </div>
);

export interface RtlDecoratorArgs {
  dir?: "rtl" | "ltr";
}

export const rtlDecorator: Decorator<
  RtlDecoratorArgs,
  keyof RtlDecoratorArgs
> = (Story, { args: { dir, ...args } }) => (
  <div dir={dir}>
    <Story {...args} />
  </div>
);
