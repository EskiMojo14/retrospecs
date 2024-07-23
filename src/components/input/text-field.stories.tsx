import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { TextField } from "./text-field";

interface StoryProps
  extends Omit<
    ComponentPropsWithoutRef<typeof TextField>,
    "icon" | "trailingIcon"
  > {
  icon: boolean;
  trailingIcon: boolean;
}

const meta = {
  title: "Components/TextField",
  render: ({ icon, trailingIcon, ...args }) => (
    <TextField
      {...args}
      icon={icon ? <Symbol>id_card</Symbol> : undefined}
      trailingIcon={
        trailingIcon ? (
          <IconButton slot="trailing" aria-label="Clear">
            <Symbol>cancel</Symbol>
          </IconButton>
        ) : undefined
      }
    />
  ),
  args: {
    onChange: fn(),
    isDisabled: false,
    textarea: false,
    icon: true,
    trailingIcon: true,
    label: "Label",
    description: "Description",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
