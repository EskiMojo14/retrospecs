import type { Meta, StoryObj } from "@storybook/react";
import { toastTypes, type Toast } from "./constants";
import { GlobalToastRegion } from "./toast-region";
import { toastQueue } from ".";
import { Button, LinkButton } from "@/components/button";
import { Symbol } from "@/components/symbol";

interface StoryProps extends Toast {
  hasAction?: boolean;
}

const meta = {
  title: "Components/Toast",
  render: ({ symbol, hasAction, ...toast }) => (
    <>
      <Button
        onPress={() =>
          toastQueue.add({
            ...toast,
            symbol: symbol ? <Symbol>{symbol}</Symbol> : undefined,
            actions: hasAction
              ? ({ close }) => (
                  <LinkButton onPress={close} href="#">
                    Take me there
                  </LinkButton>
                )
              : undefined,
          })
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
  },
  args: {
    type: "info",
    title: "",
    description: "This is a toast message.",
    inverse: false,
    hasAction: false,
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
