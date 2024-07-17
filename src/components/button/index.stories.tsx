import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonColors, buttonVariants } from "./constants";
import { Button } from ".";
import { inverseContainerDecorator } from "@/util/storybook";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: buttonVariants,
      table: {
        disable: true,
      },
    },
    color: {
      control: "select",
      options: buttonColors,
    },
    inverse: {
      control: "boolean",
    },
  },
  args: {
    onPress: fn(),
    children: "Button",
    isDisabled: false,
    color: "default",
    inverse: false,
  },
  decorators: [inverseContainerDecorator],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    variant: {
      table: { disable: false },
    },
  },
  args: {},
};

export const Text: Story = {
  args: {
    variant: "text",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
  },
};
