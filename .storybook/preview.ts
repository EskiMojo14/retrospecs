import type { Preview } from "@storybook/react";
import {
  darkThemeDecorator,
  rtlDecorator,
} from "../src/util/storybook/decorators";
import "./scss-loader.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
  },
  args: {
    dark: false,
    dir: "ltr",
  },
  argTypes: {
    dark: {
      control: "boolean",
    },
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
  },
  decorators: [darkThemeDecorator, rtlDecorator],
};

export default preview;
