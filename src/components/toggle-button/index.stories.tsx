import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ToggleButton } from ".";

const meta = {
  title: "Components/Toggle Button",
  component: ToggleButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
  },
  args: { onChange: fn(), isDisabled: false },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};
