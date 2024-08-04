import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { Button } from "~/components/button";
import { Tooltip, TooltipTrigger } from "~/components/tooltip";
import type { Color } from "~/theme/colors";
import { colors } from "~/theme/colors";
import type { AvatarGroupProps } from ".";
import { Avatar, AvatarGroup } from ".";

export interface StoryProps
  extends ComponentPropsWithoutRef<typeof Avatar>,
    Pick<AvatarGroupProps<any>, "spacing" | "max"> {}

const meta = {
  title: "Components/Avatar",
  component: Avatar as ComponentType<StoryProps>,
  argTypes: {
    size: {
      control: "select",
      options: ["x-small", "small", "medium", "large"],
    },
    color: {
      control: "select",
      options: colors,
    },
    children: {
      control: "text",
    },
    font: {
      control: "inline-radio",
      options: ["standard", "funky"],
    },
    spacing: { table: { disable: true } },
  },
  args: {
    color: "blue",
    name: "John Smith",
    src: "https://avatars.githubusercontent.com/u/18308300?v=4",
    size: "medium",
    children: undefined,
    font: "funky",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

const examples: Array<{ name: string; color: Color; src?: string }> = [
  {
    name: "Tom",
    color: "blue",
    src: "https://avatars.githubusercontent.com/u/18308300?v=4",
  },
  {
    name: "Dick",
    color: "pink",
    src: "https://avatars.githubusercontent.com/u/176902558?v=4",
  },
  { name: "Harry", color: "green" },
  { name: "Jeremy", color: "amber" },
  { name: "Bertha", color: "teal" },
  { name: "Charles", color: "gold" },
];

export const Group: Story = {
  argTypes: {
    name: { table: { disable: true } },
    src: { table: { disable: true } },
    children: { table: { disable: true } },
    max: {
      control: {
        type: "range",
        min: 2,
        max: examples.length,
      },
    },
    spacing: {
      control: "inline-radio",
      options: ["small", "medium", "large"],
      table: { disable: false },
    },
  },
  render: ({ font, color, size, spacing, max }) => (
    <TooltipTrigger>
      <Button>
        <AvatarGroup {...{ font, color, size, spacing, max }} items={examples}>
          {(props) => <Avatar id={props.name} {...props} />}
        </AvatarGroup>
      </Button>
      <Tooltip>Reactions from Tom, Dick, and 4 more</Tooltip>
    </TooltipTrigger>
  ),
  args: {
    spacing: "medium",
    size: "x-small",
    max: 5,
  },
};
