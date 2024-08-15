import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { Header, Keyboard, Section } from "react-aria-components";
import { Divider } from "~/components/divider";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Typography } from "~/components/typography";
import type { MenuItem as TMenuItem } from "./render";
import { renderMenuItem } from "./render";
import type { MenuProps } from ".";
import { Menu, MenuItem, MenuItemText } from ".";

interface StoryProps {
  variant: "one-line" | "two-line";
  selectionMode: MenuProps<{}>["selectionMode"];
}

const meta = {
  title: "Components/Menu",
  argTypes: {
    variant: {
      control: {
        type: "select",
      },
      options: ["one-line", "two-line"],
    },
  },
  args: {
    variant: "one-line",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
  render: (args) => (
    <Menu
      {...args}
      trigger={
        <IconButton tooltip="More">
          <Symbol>more_vert</Symbol>
        </IconButton>
      }
      triggerProps={{ defaultOpen: true }}
    >
      <MenuItem>
        <Symbol slot="leading">home</Symbol>
        <MenuItemText
          label="Item 1"
          description={
            args.variant === "two-line" ? "Description 2" : undefined
          }
        />
        <Symbol slot="trailing">person</Symbol>
      </MenuItem>
      <Divider />
      <MenuItem>
        <Symbol slot="leading">home</Symbol>
        <MenuItemText
          label="Item 2"
          description={
            args.variant === "two-line" ? "Description 2" : undefined
          }
        />
        <Keyboard>⌘N</Keyboard>
      </MenuItem>
      <Divider />
      <Section>
        <Typography variant="subtitle2" as={Header}>
          Section
        </Typography>
        <MenuItem>
          <MenuItemText label="Item 3" />
        </MenuItem>
        <Divider variant="inset" />
        <MenuItem>
          <MenuItemText label="Item 4" />
        </MenuItem>
      </Section>
      <Divider />
      <Menu
        isSubMenu
        trigger={
          <MenuItem>
            <Symbol slot="leading">home</Symbol>
            <MenuItemText label="Submenu" />
          </MenuItem>
        }
      >
        <MenuItem>
          <MenuItemText label="Item 5" />
        </MenuItem>
        <MenuItem>
          <MenuItemText label="Item 6" />
        </MenuItem>
      </Menu>
    </Menu>
  ),
};

const items: Array<TMenuItem> = [
  {
    id: "1",
    leading: <Symbol slot="leading">home</Symbol>,
    label: "Item 1",
    trailing: <Symbol slot="trailing">person</Symbol>,
    divider: true,
  },
  {
    id: "2",
    leading: <Symbol slot="leading">home</Symbol>,
    label: "Item 2",
    trailing: <Keyboard>⌘N</Keyboard>,
    divider: true,
  },
  {
    type: "section",
    id: "3",
    header: "Section",
    divider: true,
    children: [
      {
        id: "4",
        label: "Item 3",
        divider: "inset",
      },
      {
        id: "5",
        label: "Item 4",
        divider: "inset",
      },
    ],
  },
  {
    type: "submenu",
    id: "6",
    leading: <Symbol slot="leading">home</Symbol>,
    label: "Submenu",
    children: [
      {
        id: "7",
        label: "Item 5",
        divider: true,
      },
      {
        id: "8",
        label: "Item 6",
        divider: true,
      },
    ],
  },
];

export const Dynamic: Story = {
  argTypes: { variant: { table: { disable: true } } },
  render: (args) => (
    <Menu
      {...args}
      trigger={
        <IconButton tooltip="More">
          <Symbol>more_vert</Symbol>
        </IconButton>
      }
      triggerProps={{ defaultOpen: true }}
      items={items}
    >
      {renderMenuItem}
    </Menu>
  ),
};

function SelectDemo({ selectionMode }: StoryProps) {
  const [selected, setSelected] = useState<Selection>(new Set());
  return (
    <Menu
      trigger={
        <IconButton tooltip="More">
          <Symbol>more_vert</Symbol>
        </IconButton>
      }
      triggerProps={{ isOpen: true }}
      items={[
        {
          id: "1",
          label: "Item 1",
          leading: <Symbol slot="leading">home</Symbol>,
        },
        {
          id: "2",
          label: "Item 2",
          leading: <Symbol slot="leading">home</Symbol>,
        },
      ]}
      selectionMode={selectionMode}
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      {renderMenuItem}
    </Menu>
  );
}

export const Selectable: Story = {
  argTypes: {
    variant: { table: { disable: true } },
    selectionMode: {
      control: "inline-radio",
      options: ["single", "multiple"],
    },
  },
  render: (args) => <SelectDemo {...args} />,
  args: {
    selectionMode: "single",
  },
};