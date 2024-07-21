import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Checkbox } from ".";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    onChange: fn(),
    children: "Label",
    isDisabled: false,
    isIndeterminate: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const DynamicLabel: Story = {
  argTypes: {
    children: { table: { disable: true } },
  },
  args: {
    children: ({ isSelected }) => (isSelected ? "Selected" : "Not selected"),
  },
};
