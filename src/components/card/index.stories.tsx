import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef } from "react";
import { Button } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { cardColors, cardVariants } from "./constants";
import { Card, CardActions, CardPrimaryAction, CardSection } from ".";

interface StoryArgs extends ComponentPropsWithoutRef<typeof Card> {
  onPrimaryAction?: () => void;
  onActionButton?: () => void;
  onActionIcon?: () => void;
}

const meta: Meta<ComponentPropsWithoutRef<typeof Card> & StoryArgs> = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    color: {
      control: "select",
      options: [undefined, ...cardColors],
    },
    variant: {
      control: "select",
      options: cardVariants,
    },
    onPrimaryAction: { table: { disable: true } },
    onActionButton: { table: { disable: true } },
    onActionIcon: { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ onPrimaryAction, onActionButton, onActionIcon, ...args }) => (
    <Card {...args}>
      <CardPrimaryAction
        onPress={onPrimaryAction}
        style={{
          padding: "16px",
        }}
      >
        Primary action
      </CardPrimaryAction>
      <CardSection
        style={{
          padding: "16px",
        }}
      >
        Normal section
      </CardSection>
      <CardActions color="teal">
        <Toolbar slot="buttons">
          <Button onPress={onActionButton}>Button</Button>
          <Button onPress={onActionButton}>Button</Button>
        </Toolbar>
        <Toolbar slot="icons">
          <IconButton onPress={onActionIcon} tooltip="Edit">
            <Symbol>edit</Symbol>
          </IconButton>
          <IconButton tooltip="Delete">
            <Symbol>delete</Symbol>
          </IconButton>
        </Toolbar>
      </CardActions>
    </Card>
  ),
  args: {
    onPrimaryAction: fn(),
    onActionButton: fn(),
    onActionIcon: fn(),
  },
};
