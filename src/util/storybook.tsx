import { AppStore, makeStore, PreloadedState } from "@/store";
import type { Meta, Args } from "@storybook/react";
import { Provider } from "react-redux";

type DecoratorFunction<TArgs = Args> = Extract<
  NonNullable<Meta<TArgs>["decorators"]>,
  (...args: any) => any
>;

export const createReduxDecorator =
  ({
    preloadedState,
    store = makeStore(preloadedState),
  }: {
    preloadedState?: PreloadedState;
    store?: AppStore;
  }): DecoratorFunction =>
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  );
