import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "react-aria-components";
import { Avatar } from "~/components/avatar";
import { Checkbox } from "~/components/checkbox";
import { Divider, DividerFragment } from "~/components/divider";
import { IconButton } from "~/components/icon-button";
import { Image } from "~/components/image";
import { Switch } from "~/components/switch";
import { Symbol } from "~/components/symbol";
import { List, ListItem, ListItemText } from ".";

interface StoryProps {
  isDisabled: boolean;
  leading?:
    | "avatar"
    | "icon"
    | "image-square"
    | "image-rectangle"
    | "checkbox"
    | "switch";
  trailing?: "icon" | "text" | "checkbox" | "switch" | "icon-button";
  divider: "none" | "full" | "inset" | "middle";
}

function Leading({ leading }: Pick<StoryProps, "leading">) {
  switch (leading) {
    case "avatar":
      return <Avatar name="Avatar" />;
    case "icon":
      return <Symbol slot="icon">person</Symbol>;
    case "image-square":
      return <Image src="https://picsum.photos/300" aspectRatio="square" />;
    case "image-rectangle":
      return (
        <Image src="https://picsum.photos/300/200" aspectRatio="sixteen-nine" />
      );
    case "checkbox":
      return <Checkbox slot="selection" />;
    case "switch":
      return <Switch />;
    default:
      return null;
  }
}

function Trailing({ trailing }: Pick<StoryProps, "trailing">) {
  switch (trailing) {
    case "icon":
      return <Symbol slot="icon">chevron_right</Symbol>;
    case "text":
      return <Text slot="supporting">100+</Text>;
    case "checkbox":
      return <Checkbox slot="selection" />;
    case "switch":
      return <Switch />;
    case "icon-button":
      return (
        <IconButton tooltip="Edit">
          <Symbol>edit</Symbol>
        </IconButton>
      );
    default:
      return null;
  }
}

const meta = {
  title: "Components/List",
  argTypes: {
    leading: {
      control: "select",
      options: [
        undefined,
        "avatar",
        "icon",
        "image-square",
        "image-rectangle",
        "checkbox",
        "switch",
      ],
    },
    trailing: {
      control: "select",
      options: [undefined, "icon", "text", "checkbox", "switch", "icon-button"],
    },
    divider: {
      control: "select",
      options: ["none", "full", "inset", "middle"],
    },
  },
  args: {
    isDisabled: false,
    leading: undefined,
    divider: "none",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<StoryProps>;

const oneLineItems = [{ headline: "Headline" }, { headline: "Headline 2" }];

export const OneLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="one-line"
      items={oneLineItems}
      style={{
        background: "var(--surface)",
        minWidth: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const twoLineItems = [
  { headline: "Headline", supporting: "Supporting" },
  { headline: "Headline 2", supporting: "Supporting 2" },
];

export const TwoLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="two-line"
      items={twoLineItems}
      style={{
        background: "var(--surface)",
        minWidth: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting }) => (
        <DividerFragment id={headline}>
          <ListItem id={headline} isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} supporting={supporting} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const threeLineItems = [
  {
    headline: "Headline",
    supporting: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    headline: "Headline 2",
    supporting: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export const ThreeLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="three-line"
      items={threeLineItems}
      style={{
        background: "var(--surface)",
        width: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} supporting={supporting} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const threeLineItemsWithOverline = [
  {
    headline: "Headline",
    supporting: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    overline: "Overline",
  },
  {
    headline: "Headline 2",
    supporting: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    overline: "Overline 2",
  },
];

export const ThreeLineWithOverline: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="three-line"
      items={threeLineItemsWithOverline}
      style={{
        background: "var(--surface)",
        width: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting, overline }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText
              headline={headline}
              supporting={supporting}
              overline={overline}
            />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};
