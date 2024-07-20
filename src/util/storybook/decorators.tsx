import type { ComponentType } from "react";
import { Provider } from "react-redux";
import type { AppStore, PreloadedState } from "~/store";
import { makeStore } from "~/store";

interface ReduxDecoratorConfig {
  preloadedState?: PreloadedState;
  store?: AppStore;
}

export const createReduxDecorator =
  ({
    preloadedState,
    store = makeStore(preloadedState),
  }: ReduxDecoratorConfig) =>
  // eslint-disable-next-line react/display-name
  (Story: ComponentType) => (
    <Provider store={store}>
      <Story />
    </Provider>
  );

export interface DarkThemeDecoratorArgs {
  dark?: boolean;
}

export const darkThemeDecorator = <TArgs extends DarkThemeDecoratorArgs>(
  Story: ComponentType<Omit<TArgs, "dark">>,
  { args: { dark, ...args } }: { args: TArgs },
) => (
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
