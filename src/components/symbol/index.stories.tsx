import type { Meta, StoryObj } from "@storybook/react";
import { Symbol } from ".";

const meta = {
  title: "Components/Symbol",
  component: Symbol,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    children: {
      control: "text",
    },
    fill: {
      control: "boolean",
    },
    weight: {
      control: "select",
      options: [100, 200, 300, 400, 500, 600, 700],
    },
    grade: {
      control: {
        type: "number",
        min: -25,
        max: 200,
      },
    },
    size: {
      control: {
        type: "number",
        min: 20,
        max: 48,
      },
    },
    opticalSize: {
      control: {
        type: "number",
        min: 20,
        max: 48,
      },
    },
  },
  args: {
    children: "edit",
  },
} satisfies Meta<typeof Symbol>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
