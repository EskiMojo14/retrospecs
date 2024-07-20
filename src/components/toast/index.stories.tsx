import type { Meta, StoryObj } from "@storybook/react";
import { Button, LinkButton } from "~/components/button";
import { Symbol } from "~/components/symbol";
import type { DarkThemeDecoratorArgs } from "~/util/storybook/decorators";
import { toastTypes, type Toast } from "./constants";
import { GlobalToastRegion } from "./toast-region";
import { toastQueue } from ".";

interface StoryProps extends Toast, DarkThemeDecoratorArgs {
  hasAction?: boolean;
  timeout?: number;
  dir: "ltr" | "rtl";
}

const meta = {
  title: "Components/Toast",
  render: ({ symbol, hasAction, timeout, dir, dark, ...toast }) => {
    document.dir = dir;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    return (
      <>
        <Button
          onPress={() =>
            toastQueue.add(
              {
                ...toast,
                symbol: symbol ? <Symbol>{symbol}</Symbol> : undefined,
                actions: hasAction
                  ? ({ close }) => (
                      <LinkButton variant="outlined" onPress={close} href="#">
                        Take me there
                      </LinkButton>
                    )
                  : undefined,
              },
              { timeout },
            )
          }
        >
          Queue toast
        </Button>
        <GlobalToastRegion />
      </>
    );
  },
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: toastTypes,
    },
    symbol: {
      control: "text",
    },
    timeout: {
      control: "number",
    },
    dir: {
      control: "radio",
      options: ["ltr", "rtl"],
    },
  },
  args: {
    type: "default",
    title: "",
    description: "This is a toast message.",
    hasAction: false,
    timeout: undefined,
    dir: "ltr",
    dark: false,
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
