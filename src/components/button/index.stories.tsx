import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { useState } from "react";
import { Symbol } from "~/components/symbol";
import { buttonColors, buttonVariants } from "./constants";
import type { ButtonGroupProps, ToggleButtonProps } from ".";
import { Button, ButtonGroup, LinkButton, ToggleButton } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof Button>,
    Pick<ToggleButtonProps, "onChange">,
    Pick<ButtonGroupProps<object>, "orientation" | "label" | "description"> {
  icon?: "leading" | "trailing";
}

const meta = {
  title: "Components/Button",
  component: Button as ComponentType<StoryProps>,
  argTypes: {
    variant: {
      control: "select",
      options: buttonVariants,
    },
    color: {
      control: "select",
      options: buttonColors,
    },
    onPress: { table: { disable: true } },
  },
  args: {
    onPress: fn(),
    children: ({ isDisabled }) => (isDisabled ? "Disabled" : "Click me"),
    isDisabled: false,
    color: "gold",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const TextButton: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "text",
  },
};

export const OutlinedButton: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "outlined",
  },
};

export const FilledButton: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "filled",
  },
};

export const ElevatedButton: Story = {
  argTypes: {
    variant: {
      table: { disable: true },
    },
  },
  args: {
    variant: "elevated",
  },
};

export const ButtonWithIcon: Story = {
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    icon: {
      control: {
        type: "inline-radio",
      },
      options: ["leading", "trailing"],
    },
  },
  render: ({ icon, ...args }) => (
    <Button {...args}>
      {icon === "leading" && <Symbol slot="leading">favorite</Symbol>}
      Favorite
      {icon === "trailing" && <Symbol slot="trailing">favorite</Symbol>}
    </Button>
  ),
  args: {
    icon: "leading",
  },
};

export const Toggle: Story = {
  render: (args) => (
    <ToggleButton {...args}>
      {({ isSelected }) => (
        <>
          <Symbol slot="leading">favorite</Symbol>
          {isSelected ? "Active" : "Inactive"}
        </>
      )}
    </ToggleButton>
  ),
  args: {
    onChange: fn(),
  },
};

export const Link: Story = {
  render: (args) => <LinkButton {...args} href="#" />,
  args: {},
};

const iconMap = {
  none: {
    icon: "volume_mute",
    label: "None",
  },
  low: {
    icon: "volume_down",
    label: "Low volume",
  },
  heavy: {
    icon: "volume_up",
    label: "Heavy",
  },
};

const entries = Object.entries(iconMap);

function GroupComponent({
  isDisabled,
  color,
  orientation,
  variant,
  label,
  description,
}: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <ButtonGroup
      {...{
        isDisabled,
        color,
        variant,
        orientation,
        label,
        description,
      }}
      id="groove-group"
      items={entries}
      dependencies={[value]}
    >
      {([key, { icon, label }]) => (
        <ToggleButton
          key={key}
          id={key}
          isSelected={value === key}
          onChange={() => {
            setValue(key);
          }}
        >
          <Symbol slot="leading">{icon}</Symbol>
          {label}
        </ToggleButton>
      )}
    </ButtonGroup>
  );
}

export const Group: Story = {
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  args: {
    orientation: "horizontal",
    variant: "elevated",
    label: "Groove",
    description:
      'Whether to use loud backgrounds or not. "Low volume" tones it down a little.',
  },
  render: (args) => <GroupComponent {...args} />,
};
