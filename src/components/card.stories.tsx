import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import {
  Card,
  CardActionButton,
  CardActionButtons,
  CardActionIcon,
  CardActionIcons,
  CardActions,
  CardPrimaryAction,
  CardSection,
  cardTypes,
} from "./card";
import { Symbol } from "./symbol";

interface StoryArgs {
  onPrimaryAction?: () => void;
  onActionButton?: () => void;
  onActionIcon?: () => void;
  style?: CSSProperties;
}

const meta: Meta<ComponentPropsWithoutRef<typeof Card> & StoryArgs> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: cardTypes,
      table: { defaultValue: { summary: "default" } },
    },
    ...({
      onPrimaryAction: { table: { disable: true } },
      onActionButton: { table: { disable: true } },
      onActionIcon: { table: { disable: true } },
      style: { table: { disable: true } },
    } satisfies { [K in keyof StoryArgs]: { table: { disable: true } } }),
  },
  args: {},
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
      <CardActions>
        <CardActionButtons>
          <CardActionButton onPress={onActionButton}>Button</CardActionButton>
        </CardActionButtons>
        <CardActionIcons>
          <CardActionIcon onPress={onActionIcon}>
            <Symbol>edit</Symbol>
          </CardActionIcon>
        </CardActionIcons>
      </CardActions>
    </Card>
  ),
  args: {
    onPrimaryAction: fn(),
    onActionButton: fn(),
    onActionIcon: fn(),
  },
};

export const NoContent: Story = {
  args: {
    withBg: true,
    style: {
      width: "200px",
      height: "200px",
    },
  },
};
