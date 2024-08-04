import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../icon-button";
import { Symbol } from "../symbol";
import type { Tooltip } from ".";

const meta = {
  title: "Components/Tooltip",
  render: (args) => (
    <IconButton
      variant="filled"
      tooltip="Edit"
      tooltipProps={args}
      tooltipTriggerProps={{
        delay: 0,
        closeDelay: 0,
      }}
    >
      <Symbol>edit</Symbol>
    </IconButton>
  ),
  argTypes: {
    placement: {
      control: "select",
      options: [
        "bottom",
        "bottom left",
        "bottom right",
        "bottom start",
        "bottom end",
        "top",
        "top left",
        "top right",
        "top start",
        "top end",
        "left",
        "left top",
        "left bottom",
        "start",
        "start top",
        "start bottom",
        "right",
        "right top",
        "right bottom",
        "end",
        "end top",
        "end bottom",
      ],
    },
  },
  args: {
    placement: "top",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
