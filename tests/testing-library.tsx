import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { Provider } from "react-redux";
import type { AppStore, PreloadedState } from "@/store";
import { makeStore } from "@/store";

export const renderWithUser = (...args: Parameters<typeof render>) => ({
  user: userEvent.setup(),
  ...render(...args),
});

interface RenderWithProviderOptions extends RenderOptions {
  preloadedState?: PreloadedState;
  store?: AppStore;
}

export const renderWithProvider = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = makeStore(preloadedState),
    wrapper: Wrapper,
    ...options
  }: RenderWithProviderOptions = {},
) => ({
  store,
  ...render(ui, {
    ...options,
    wrapper: (props) => (
      <Provider store={store}>
        {Wrapper ? <Wrapper {...props} /> : props.children}
      </Provider>
    ),
  }),
});
