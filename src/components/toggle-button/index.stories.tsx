import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { useState } from "react";
import { Label, Text } from "react-aria-components";
import { buttonColors } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import { Typography } from "~/components/typography";
import { ToggleButton, ToggleButtonGroup } from ".";

const meta = {
  title: "Components/Toggle Button",
  component: ToggleButton,
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
    children: {
      table: {
        disable: true,
      },
    },
    color: {
      control: "select",
      options: [undefined, ...buttonColors],
    },
  },
  args: { onChange: fn(), isDisabled: false, compact: false },
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: ({ isSelected }) => (isSelected ? "Active" : "Inactive"),
  },
};

export const WithIcon: Story = {
  args: {
    children: ({ isSelected }) => (
      <>
        <Symbol fill={isSelected} transition slot="leading">
          favorite
        </Symbol>
        Favorite
      </>
    ),
  },
};

function GroupComponent({
  isDisabled,
  color,
  compact,
}: ComponentPropsWithoutRef<typeof ToggleButton>) {
  const [value, setValue] = useState("none");
  return (
    <section>
      <ToggleButtonGroup
        {...{ isDisabled, color, compact }}
        aria-labelledby="groove-label"
      >
        <Typography as={Label} variant="body1" id="groove-label">
          Groove
        </Typography>
        <ToggleButton
          isSelected={value === "none"}
          onChange={() => {
            setValue("none");
          }}
        >
          <Symbol fill={value === "none"} transition slot="leading">
            volume_mute
          </Symbol>
          None
        </ToggleButton>
        <ToggleButton
          isSelected={value === "low"}
          onChange={() => {
            setValue("low");
          }}
        >
          <Symbol fill={value === "low"} transition slot="leading">
            volume_down
          </Symbol>
          Low volume
        </ToggleButton>
        <ToggleButton
          isSelected={value === "heavy"}
          onChange={() => {
            setValue("heavy");
          }}
        >
          <Symbol fill={value === "heavy"} transition slot="leading">
            volume_up
          </Symbol>
          Heavy
        </ToggleButton>
        <Typography as={Text} variant="caption" id="groove-label">
          Whether to use loud backgrounds or not. &ldquo;Low volume&rdquo; tones
          it down a little.
        </Typography>
      </ToggleButtonGroup>
    </section>
  );
}

export const Group: Story = {
  render: (props) => <GroupComponent {...props} />,
};
