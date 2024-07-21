import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { useState } from "react";
import { Label, Text } from "react-aria-components";
import { buttonColors } from "~/components/button/constants";
import { Symbol } from "~/components/symbol";
import { Typography } from "~/components/typography";
import { ToggleButton, ToggleButtonGroup, ToggleButtons } from ".";

interface StoryProps extends ComponentPropsWithoutRef<typeof ToggleButton> {
  orientation: "horizontal" | "vertical";
}

const meta = {
  title: "Components/Toggle Button",
  component: ToggleButton as ComponentType<StoryProps>,
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
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    onChange: fn(),
    isDisabled: false,
    compact: false,
    orientation: "horizontal",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  argTypes: {
    orientation: {
      table: { disable: true },
    },
  },
  args: {
    children: ({ isSelected }) => (isSelected ? "Active" : "Inactive"),
  },
};

export const WithIcon: Story = {
  argTypes: {
    orientation: {
      table: { disable: true },
    },
  },
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
  orientation,
}: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <ToggleButtonGroup
      {...{ isDisabled, color, compact }}
      aria-labelledby="groove-label"
      aria-describedby="groove-description"
    >
      <Typography as={Label} variant="body1" id="groove-label">
        Groove
      </Typography>
      <ToggleButtons orientation={orientation} aria-label="Options">
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
      </ToggleButtons>
      <Typography as={Text} variant="caption" id="groove-description">
        Whether to use loud backgrounds or not. &ldquo;Low volume&rdquo; tones
        it down a little.
      </Typography>
    </ToggleButtonGroup>
  );
}

export const Grouped: Story = {
  render: (props) => <GroupComponent {...props} />,
};
