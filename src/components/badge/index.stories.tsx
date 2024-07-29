import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { colors } from "~/theme/colors";
import type { DistributiveOmit } from "~/util/types";
import { Badge } from ".";

const meta = {
  title: "Components/Badge",
  render: (args) => (
    <IconButton aria-label={`${args.badgeContent?.toString()} notifications`}>
      <Badge {...args}>
        <Symbol>notifications</Symbol>
      </Badge>
    </IconButton>
  ),
  argTypes: {
    variant: { table: { disable: true } },
    color: { control: "select", options: colors },
    overlap: { control: "inline-radio", options: ["circle", "rectangle"] },
  },
  args: {
    badgeContent: 1,
    showZero: false,
    max: 99,
    color: "gold",
    collapsed: false,
    variant: "standard",
    overlap: "rectangle",
  },
} satisfies Meta<
  DistributiveOmit<ComponentPropsWithoutRef<typeof Badge>, "children">
>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Dot: Story = {
  render: (args) => (
    <IconButton aria-label="Notifications">
      <Badge {...args}>
        <Symbol>notifications</Symbol>
      </Badge>
    </IconButton>
  ),
  argTypes: {
    badgeContent: { table: { disable: true } },
    showZero: { table: { disable: true } },
    max: { table: { disable: true } },
  },
  args: { variant: "dot" },
};
