import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState, type ComponentProps, type ComponentType } from "react";
import { ToggleButton, ToggleButtonGroup } from ".";

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
    dir: {
      table: { disable: true },
    },
    isDisabled: {
      control: "boolean",
    },
  },
  args: { onChange: fn(), isDisabled: false },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

function GroupComponent({ isDisabled, dir }: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <ToggleButtonGroup isDisabled={isDisabled} dir={dir}>
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
