import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import type { ToggleButtonProps } from "~/components/button";
import { ToggleButton } from "~/components/button";
import { buttonColors, buttonVariants } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import { IconButton } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof IconButton>,
    Pick<ToggleButtonProps, "onChange"> {}

const meta = {
  title: "Components/Icon Button",
  component: IconButton as ComponentType<StoryProps>,
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
    isDisabled: false,
    children: <Symbol>edit</Symbol>,
    tooltip: "Edit",
  },
} satisfies Meta<StoryProps>;

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
    <IconButton as={ToggleButton} {...args}>
      <Symbol>favorite</Symbol>
    </IconButton>
  ),
  args: {
    tooltip: "Favorite",
    onChange: fn(),
  },
};
