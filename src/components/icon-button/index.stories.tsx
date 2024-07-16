import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { IconButton } from ".";
import { buttonVariants } from "@/components/button/constants";
import { Symbol } from "@/components/symbol";

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
    },
    compact: {
      control: "boolean",
    },
    isDisabled: {
      control: "boolean",
    },
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: { onPress: fn(), compact: false, isDisabled: false },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
    children: <Symbol>edit</Symbol>,
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: <Symbol>edit</Symbol>,
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
    children: <Symbol>edit</Symbol>,
  },
};
