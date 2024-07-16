import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonVariants } from "./constants";
import { Button } from ".";

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
    },
  },
  args: { onPress: fn() },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    variant: "text",
    children: "Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Button",
  },
};

export const Contained: Story = {
  args: {
    variant: "contained",
    children: "Button",
  },
};
