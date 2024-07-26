import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  useState,
  type ComponentPropsWithoutRef,
  type ComponentType,
} from "react";
import { Text } from "react-aria-components";
import { Symbol } from "~/components/symbol";
import { buttonColors, buttonVariants } from "./constants";
import {
  Button,
  ButtonGroup,
  FloatingActionButton,
  LinkButton,
  ToggleButton,
} from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof Button>,
    Pick<
      ComponentPropsWithoutRef<typeof ButtonGroup>,
      "orientation" | "label" | "description"
    >,
    Pick<
      ComponentPropsWithoutRef<typeof FloatingActionButton>,
      "extended" | "exited"
    > {
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
    compact: false,
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
  label,
  description,
}: StoryProps) {
  const [value, setValue] = useState("none");
  return (
    <ButtonGroup
      {...{
        isDisabled,
        color,
        compact,
        variant,
        orientation,
        label,
        description,
      }}
      id="groove-group"
    >
      <ToggleButton
        isSelected={value === "none"}
        onChange={() => {
          setValue("none");
        }}
      >
        <Symbol slot="leading">volume_mute</Symbol>
        None
      </ToggleButton>
      <ToggleButton
        isSelected={value === "low"}
        onChange={() => {
          setValue("low");
        }}
      >
        <Symbol slot="leading">volume_down</Symbol>
        Low volume
      </ToggleButton>
      <ToggleButton
        isSelected={value === "heavy"}
        onChange={() => {
          setValue("heavy");
        }}
      >
        <Symbol slot="leading">volume_up</Symbol>
        Heavy
      </ToggleButton>
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

export const Floating: Story = {
  argTypes: {
    variant: { table: { disable: true } },
    children: { table: { disable: true } },
    isDisabled: { table: { disable: true } },
  },
  args: { extended: true, exited: false },
  render: ({ ...args }) => (
    <FloatingActionButton {...args}>
      <Symbol slot="leading">add</Symbol>
      <Text slot="label">Create</Text>
    </FloatingActionButton>
  ),
};
