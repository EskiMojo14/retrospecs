import type { Meta, StoryObj } from "@storybook/react";
import { toastTypes, type Toast } from "./constants";
import { GlobalToastRegion } from "./toast-region";
import { toastQueue } from ".";
import { Button, LinkButton } from "@/components/button";
import { Symbol } from "@/components/symbol";

interface StoryProps extends Toast {
  hasAction?: boolean;
  timeout?: number;
}

const meta = {
  title: "Components/Toast",
  render: ({ symbol, hasAction, timeout, ...toast }) => (
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
  ),
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
  },
  args: {
    type: "info",
    title: "",
    description: "This is a toast message.",
    inverse: false,
    hasAction: false,
    timeout: undefined,
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
