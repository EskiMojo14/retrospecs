import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { buttonColors } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import type { DarkThemeDecoratorArgs } from "~/util/storybook/decorators";
import { darkThemeDecorator } from "~/util/storybook/decorators";
import { IconToggleButton } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof IconToggleButton>,
    DarkThemeDecoratorArgs {}

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
      options: [undefined, ...buttonColors],
    },
  },
  args: {
    onChange: fn(),
    isDisabled: false,
    dark: false,
    compact: false,
  },
  decorators: [darkThemeDecorator],
} satisfies Meta<StoryProps>;

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
