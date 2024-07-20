import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";
import { backgroundColors } from "./constants";
import { LineBackground } from ".";

interface StoryProps extends ComponentPropsWithoutRef<typeof LineBackground> {
  dir?: "rtl" | "ltr";
}

const meta = {
  title: "Components/LineBackground",
  render: ({ dir, ...props }) => (
    <div
      style={{ height: "50vh", width: "50vw", position: "relative" }}
      dir={dir}
    >
      <LineBackground {...props} />
    </div>
  ),
  parameters: {
    layout: "centered",
  },
  argTypes: {
    scale: {
      control: {
        type: "range",
        min: 0.5,
        max: 2,
        step: 0.5,
      },
    },
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
    color: {
      control: "select",
      options: [undefined, ...backgroundColors],
    },
  },
  args: { scale: 1, dir: "ltr", color: undefined },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
