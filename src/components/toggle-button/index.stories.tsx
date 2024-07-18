import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from ".";
import { buttonColors } from "@/components/button/constants";
import { Symbol } from "@/components/symbol";
import { Typography } from "@/components/typography";
import { inverseContainerDecorator } from "@/util/storybook";

interface StoryProps extends ComponentProps<typeof ToggleButton> {
  dir?: string;
}

const meta = {
  title: "Components/Toggle Button",
  component: ToggleButton as ComponentType<StoryProps>,
  parameters: {
    layout: "centered",
  },
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
  args: { onChange: fn(), isDisabled: false, inverse: false },
  decorators: [inverseContainerDecorator],
} satisfies Meta<StoryProps>;

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

function GroupComponent({ isDisabled, dir, color, inverse }: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <section>
      <Typography variant="body1" id="groove-label">
        Groove
      </Typography>
      <ToggleButtonGroup
        {...{ isDisabled, dir, color, inverse }}
        aria-labelledby="groove-label"
      >
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
      </ToggleButtonGroup>
      <Typography variant="caption" id="groove-label">
        Whether to use loud backgrounds or not. &ldquo;Low volume&rdquo; tones
        it down a little.
      </Typography>
    </section>
  );
}

export const Group: Story = {
  args: { dir: "ltr" },
  argTypes: {
    dir: {
      control: "inline-radio",
      options: ["ltr", "rtl"],
      table: { disable: false },
    },
  },
  render: (props) => <GroupComponent {...props} />,
};
