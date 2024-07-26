import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "~/theme/colors";
import { Avatar } from ".";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  argTypes: {
    size: {
      control: {
        type: "select",
      },
      options: ["x-small", "small", "medium", "large"],
    },
    color: {
      control: {
        type: "select",
      },
      options: colors,
    },
  },
  args: {
    color: "blue",
    name: "John Smith",
    src: "https://avatars.githubusercontent.com/u/18308300?v=4",
    size: "medium",
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
