import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
} from "react";
import { Label, Text } from "react-aria-components";
import { Symbol } from "~/components/symbol";
import { Typography } from "../typography";
import { buttonColors, buttonVariants } from "./constants";
import { Button, ButtonGroup, Buttons, LinkButton, ToggleButton } from ".";

interface StoryProps extends ComponentPropsWithoutRef<typeof Button> {
  icon?: "leading" | "trailing";
  orientation?: "horizontal" | "vertical";
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
      options: [undefined, ...buttonColors],
    },
  },
  args: {
    onPress: fn(),
    children: ({ isDisabled }) => (isDisabled ? "Disabled" : "Click me"),
    isDisabled: false,
    compact: false,
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
          <Symbol fill={isSelected} transition slot="leading">
            favorite
          </Symbol>
          {isSelected ? "Active" : "Inactive"}
        </>
      )}
    </ToggleButton>
  ),
  args: {},
};

export const Link: Story = {
  render: (args) => <LinkButton {...args} href="#" />,
  args: {},
};

function GroupComponent({
  isDisabled,
  color,
  compact,
  orientation,
  variant,
}: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <ButtonGroup
      {...{ isDisabled, color, compact, variant }}
      aria-labelledby="groove-label"
      aria-describedby="groove-description"
    >
      <Typography as={Label} variant="body1" id="groove-label">
        Groove
      </Typography>
      <Buttons orientation={orientation} aria-label="Options">
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
      </Buttons>
      <Typography as={Text} variant="caption" id="groove-description">
        Whether to use loud backgrounds or not. &ldquo;Low volume&rdquo; tones
        it down a little.
      </Typography>
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
  args: { orientation: "horizontal", variant: "elevated" },
  render: (args) => <GroupComponent {...args} />,
};
