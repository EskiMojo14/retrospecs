import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";
import { LineBackground } from ".";

interface StoryProps extends ComponentPropsWithoutRef<typeof LineBackground> {
  dir?: "rtl" | "ltr";
}

const meta = {
  title: "Components/LineBackground",
  render: ({ scale, dir }: { scale?: number; dir?: "rtl" | "ltr" }) => (
    <div
      style={{ height: "50vh", width: "50vw", position: "relative" }}
      dir={dir}
    >
      <LineBackground scale={scale} />
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
  },
  args: { scale: 1, dir: "ltr" },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
