import type { Meta, StoryObj } from "@storybook/react";
import { defaultSettings } from "./constants";
import { Symbol } from ".";

const meta = {
  title: "Components/Symbol",
  component: Symbol,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    weight: {
      control: "select",
      options: [100, 200, 300, 400, 500, 600, 700],
    },
    grade: {
      control: {
        type: "range",
        min: -25,
        max: 200,
      },
    },
    size: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
    opticalSize: {
      control: {
        type: "range",
        min: 20,
        max: 48,
      },
    },
  },
  args: {
    children: "edit",
    ...defaultSettings,
    opticalSize: undefined,
    size: 24,
    transition: false,
  },
} satisfies Meta<typeof Symbol>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
