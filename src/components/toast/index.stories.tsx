import type { Meta, StoryObj } from "@storybook/react";
import { Button, LinkButton } from "@/components/button";
import { Symbol } from "@/components/symbol";
import { toastTypes, type Toast } from "./constants";
import { GlobalToastRegion } from "./toast-region";
import { toastQueue } from ".";

interface StoryProps extends Toast {
  hasAction?: boolean;
  timeout?: number;
  dir: "ltr" | "rtl";
}

const meta = {
  title: "Components/Toast",
  render: ({ symbol, hasAction, timeout, dir, ...toast }) => {
    document.dir = dir;
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
                      <LinkButton onPress={close} href="#">
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
    type: "info",
    title: "",
    description: "This is a toast message.",
    inverse: false,
    hasAction: false,
    timeout: undefined,
    dir: "ltr",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
