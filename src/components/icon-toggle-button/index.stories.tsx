import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { IconToggleButton } from ".";
import { buttonColors } from "@/components/button/constants";
import { Symbol } from "@/components/symbol";
import { inverseContainerDecorator } from "@/util/storybook";

const meta = {
  title: "Components/Icon Toggle Button",
  component: IconToggleButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    children: {
      table: {
        disable: true,
      },
    },
    color: {
      control: "select",
      options: buttonColors,
    },
  },
  args: {
    onChange: fn(),
    isDisabled: false,
    color: "default",
    inverse: false,
    compact: false,
  },
  decorators: [inverseContainerDecorator],
} satisfies Meta<typeof IconToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: ({ isSelected }) => (
      <Symbol fill={isSelected} transition>
        favorite
      </Symbol>
    ),
  },
};
