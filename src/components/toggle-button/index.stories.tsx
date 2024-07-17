import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentProps, ComponentType } from "react";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from ".";
import { Typography } from "@/components/typography";

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
  },
  args: { onChange: fn(), isDisabled: false },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: ({ isSelected }) => (isSelected ? "Active" : "Inactive"),
  },
};

function GroupComponent({ isDisabled, dir }: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <section>
      <Typography variant="body1" id="groove-label">
        Groove
      </Typography>
      <ToggleButtonGroup
        {...{ isDisabled, dir }}
        aria-labelled-by="groove-label"
      >
        <ToggleButton
          isSelected={value === "none"}
          onChange={() => {
            setValue("none");
          }}
        >
          None
        </ToggleButton>
        <ToggleButton
          isSelected={value === "low"}
          onChange={() => {
            setValue("low");
          }}
        >
          Low volume
        </ToggleButton>
        <ToggleButton
          isSelected={value === "heavy"}
          onChange={() => {
            setValue("heavy");
          }}
        >
          Heavy
        </ToggleButton>
      </ToggleButtonGroup>
    </section>
  );
}

export const Group: Story = {
  args: { dir: "ltr" },
  argTypes: {
    dir: {
      control: "select",
      options: ["ltr", "rtl"],
      table: { disable: false },
    },
  },
  render: (props) => <GroupComponent {...props} />,
};