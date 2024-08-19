import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { colors } from "~/theme/colors";
import { Checkbox, CheckboxGroup, CheckboxItem } from ".";

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
    isDisabled: false,
    color: "gold",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: fn(),
    children: "Label",
    isIndeterminate: false,
  },
};

export const DynamicLabel: Story = {
  args: {
    onChange: fn(),
    children: ({ isSelected }) => (isSelected ? "Selected" : "Not selected"),
  },
};

export const Group: Story = {
  render: ({ color, isDisabled }) => (
    <CheckboxGroup
      color={color}
      isDisabled={isDisabled}
      label="Favorite sports"
      description="Select all that apply"
    >
      <CheckboxItem value="football">Football</CheckboxItem>
      <CheckboxItem value="rugby">Rugby</CheckboxItem>
      <CheckboxItem value="cricket">Cricket</CheckboxItem>
    </CheckboxGroup>
  ),
};
