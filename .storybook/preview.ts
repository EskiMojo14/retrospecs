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
    layout: "centered",
  },
  args: {
    dark: false,
    dir: "ltr",
  },
  argTypes: {
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
    dark: {
      control: "boolean",
    },
  },
  decorators: [darkThemeDecorator, rtlDecorator],
};

export default preview;
