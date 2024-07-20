import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import type { DarkThemeDecoratorArgs } from "~/util/storybook/decorators";
import { darkThemeDecorator } from "~/util/storybook/decorators";
import { Checkbox } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof Checkbox>,
    DarkThemeDecoratorArgs {}

const meta = {
  title: "Components/Checkbox",
  component: Checkbox as ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onChange: fn(), children: "", dark: false },
  decorators: [darkThemeDecorator],
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
