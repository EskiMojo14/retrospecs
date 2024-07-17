import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { buttonColors, buttonVariants } from "./constants";
import { Button } from ".";
import { Symbol } from "@/components/symbol";
import { inverseContainerDecorator } from "@/util/storybook";

interface StoryProps {
  icon?: "leading" | "trailing";
}

const meta = {
  title: "Components/Button",
  component: Button as ComponentType<
    ComponentPropsWithoutRef<typeof Button> & StoryProps
  >,
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
} satisfies Meta<ComponentPropsWithoutRef<typeof Button> & StoryProps>;

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
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    icon: {
      control: {
        type: "radio",
      },
      options: ["leading", "trailing"],
    },
  },
  render: ({ icon, ...args }) => (
    <Button {...args}>
      {icon === "leading" && <Symbol slot="leading">favorite</Symbol>}
      Favorite
      {icon === "trailing" && <Symbol slot="trailing">favorite</Symbol>}
    </Button>
  ),
  args: {
    icon: "leading",
  },
};
