import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { inverseContainerDecorator } from "@/util/storybook";
import { Link } from ".";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onPress: fn(), inverse: false, children: "Link", href: "#" },
  decorators: [inverseContainerDecorator],
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
