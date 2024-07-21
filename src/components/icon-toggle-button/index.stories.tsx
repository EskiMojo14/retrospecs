import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { buttonColors, buttonVariants } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import { IconToggleButton } from ".";

const meta = {
  title: "Components/Icon Toggle Button",
  component: IconToggleButton,
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
      options: [undefined, ...buttonColors],
    },
    variant: {
      control: "select",
      options: buttonVariants,
    },
  },
  args: {
    onChange: fn(),
    isDisabled: false,
    compact: false,
    variant: "text",
  },
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
