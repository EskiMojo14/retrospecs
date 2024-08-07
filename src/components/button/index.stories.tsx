import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { Symbol } from "~/components/symbol";
import { buttonColors, buttonVariants } from "./constants";
import { Button, LinkButton } from ".";

interface StoryProps extends ComponentPropsWithoutRef<typeof Button> {
  icon?: "leading" | "trailing";
}

const meta = {
  title: "Components/Button",
  component: Button as ComponentType<StoryProps>,
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
      options: [undefined, ...buttonColors],
    },
  },
  args: {
    onPress: fn(),
    children: ({ isDisabled }) => (isDisabled ? "Disabled" : "Click me"),
    isDisabled: false,
    compact: false,
  },
} satisfies Meta<StoryProps>;

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

export const WithIcon: Story = {
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    icon: {
      control: {
        type: "inline-radio",
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

export const AsLink: Story = {
  render: (args) => <LinkButton {...args} href="#" />,
  args: {},
};
