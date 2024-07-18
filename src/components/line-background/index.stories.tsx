import type { Meta, StoryObj } from "@storybook/react";
import { LineBackground } from ".";

const meta = {
  title: "Components/LineBackground",
  render: ({ scale }) => (
    <div style={{ height: "50vh", width: "50vw", position: "relative" }}>
      {" "}
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
  },
  args: { scale: 1 },
} satisfies Meta<typeof LineBackground>;

export default meta;

type Story = StoryObj<typeof LineBackground>;

export const Default: Story = {
  args: {},
};
