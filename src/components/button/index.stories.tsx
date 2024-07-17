import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonColors, buttonVariants } from "./constants";
import { Button } from ".";
import { Symbol } from "@/components/symbol";
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

export const Contained: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "contained",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Symbol slot="icon">favorite</Symbol>
        Favorite
      </>
    ),
  },
};
