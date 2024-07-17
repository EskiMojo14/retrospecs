import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { IconButton } from ".";
import { buttonColors, buttonVariants } from "@/components/button/constants";
import { Symbol } from "@/components/symbol";
import { inverseContainerDecorator } from "@/util/storybook";

const meta = {
  title: "Components/Icon Button",
  component: IconButton,
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
    children: {
      table: {
        disable: true,
      },
    },
    color: {
      control: "select",
      options: buttonColors,
    },
  },
  args: {
    onPress: fn(),
    compact: false,
    isDisabled: false,
    color: "default",
    children: <Symbol>edit</Symbol>,
    inverse: false,
  },
  decorators: [inverseContainerDecorator],
} satisfies Meta<typeof IconButton>;

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
