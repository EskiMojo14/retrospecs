import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { colors } from "~/theme/colors";
import { Checkbox } from ".";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  argTypes: {
    color: {
      control: "select",
      options: colors,
    },
  },
  args: {
    onChange: fn(),
    children: "Label",
    isDisabled: false,
    isIndeterminate: false,
    color: "gold",
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
