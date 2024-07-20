import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import type { DarkThemeDecoratorArgs } from "~/util/storybook/decorators";
import { darkThemeDecorator } from "~/util/storybook/decorators";
import { Link } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof Link>,
    DarkThemeDecoratorArgs {}

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onPress: fn(), dark: false, children: "Link", href: "#" },
  decorators: [darkThemeDecorator],
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
