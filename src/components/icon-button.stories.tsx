import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonVariants } from "./button";
import { IconButton } from "./icon-button";
import { Symbol } from "./symbol";

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
    children: {
      table: {
        disable: true,
      },
    },
  },
  args: { onPress: fn() },
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
