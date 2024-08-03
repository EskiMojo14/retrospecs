import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../icon-button";
import { Symbol } from "../symbol";
import type { Tooltip } from ".";

const meta = {
  title: "Components/Tooltip",
  render: (args) => (
    <IconButton variant="filled" tooltip="Edit" tooltipProps={args}>
      <Symbol>edit</Symbol>
    </IconButton>
  ),
  args: {},
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
