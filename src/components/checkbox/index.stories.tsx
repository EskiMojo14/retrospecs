import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { inverseContainerDecorator } from "~/util/storybook";
import { Checkbox } from ".";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onChange: fn(), children: "", inverse: false },
  decorators: [inverseContainerDecorator],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
