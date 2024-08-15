import type { Meta, StoryObj } from "@storybook/react";
import { colors } from "~/theme/colors";
import type { ProgressProps } from ".";
import { CircularProgress, LinearProgress } from ".";

const meta = {
  title: "Components/Progress",
  render: () => <div />,
  argTypes: {
    style: { table: { disable: true } },
    "aria-label": { table: { disable: true } },
    color: { control: "select", options: colors },
    value: { control: "range", min: 0, max: 100 },
  },
  args: {
    color: "gold",
    isHidden: false,
    "aria-label": "Demo progress bar",
  },
} satisfies Meta<ProgressProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DeterminateLinear: Story = {
  render: (args) => <LinearProgress {...args} />,
  args: {
    value: 50,
  },
};

export const IndeterminateLinear: Story = {
  render: (args) => <LinearProgress {...args} />,
  args: {
    isIndeterminate: true,
  },
};

export const DeterminateCircular: Story = {
  render: (args) => <CircularProgress {...args} />,
  args: {
    value: 50,
  },
};

export const IndeterminateCircular: Story = {
  render: (args) => <CircularProgress {...args} />,
  args: {
    isIndeterminate: true,
  },
};
