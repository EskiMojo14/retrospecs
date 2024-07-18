import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";
import { DialogTrigger } from "react-aria-components";
import { Dialog, DialogContent } from ".";
import { Button } from "@/components/button";
import { Symbol } from "@/components/symbol";
import { Toolbar } from "@/components/toolbar";
import { Typography, Heading } from "@/components/typography";

const meta = {
  title: "Components/Dialog",
  render: (args: ComponentPropsWithoutRef<typeof Dialog>) => (
    <DialogTrigger>
      <Button color="sunset">
        <Symbol slot="leading">delete</Symbol>
        Delete item
      </Button>
      <Dialog role="alertdialog" {...args}>
        {({ close }) => (
          <>
            <Heading variant="headline6" slot="title">
              Delete item
            </Heading>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete this item?
              </Typography>
            </DialogContent>
            <Toolbar slot="actions">
              <Button onPress={close}>Cancel</Button>
              <Button onPress={close} variant="outlined" color="sunset">
                Delete
              </Button>
            </Toolbar>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
  parameters: {
    layout: "centered",
  },
  args: {
    isDismissable: false,
    isKeyboardDismissDisabled: false,
  },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
