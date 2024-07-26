import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonColors, buttonVariants } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import { IconButton, IconToggleButton } from ".";

const meta = {
  title: "Components/Icon Button",
  component: IconButton,
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
    color: {
      control: "select",
      options: [undefined, ...buttonColors],
    },
  },
  args: {
    onPress: fn(),
    variant: "text",
    compact: false,
    isDisabled: false,
    children: <Symbol>edit</Symbol>,
  },
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
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "text",
  },
};

export const Outlined: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "outlined",
  },
};

export const Filled: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "filled",
  },
};

export const Elevated: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "elevated",
  },
};

export const Toggle: Story = {
  render: (args) => (
    <IconToggleButton {...args}>
      <Symbol>favorite</Symbol>
    </IconToggleButton>
  ),
  args: {},
};
