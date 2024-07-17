import type { ComponentType } from "react";
import { Provider } from "react-redux";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";

export const createReduxDecorator =
  ({
    preloadedState,
    store = makeStore(preloadedState),
  }: {
    preloadedState?: PreloadedState;
    store?: AppStore;
  }) =>
  // eslint-disable-next-line react/display-name
  (Story: ComponentType) => (
    <Provider store={store}>
      <Story />
    </Provider>
  );

export const inverseContainerDecorator = <TArgs extends { inverse?: boolean }>(
  Story: ComponentType<TArgs>,
  { args }: { args: TArgs },
) => (
  <div
    style={{
      padding: "1rem",
      background: args.inverse ? "var(--yellow-dark)" : "none",
    }}
  >
    <Story {...args} />
  </div>
);
