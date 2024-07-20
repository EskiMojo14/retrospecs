import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";
import { DialogTrigger } from "react-aria-components";
import { Button } from "~/components/button";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Typography, Heading } from "~/components/typography";
import type { DarkThemeDecoratorArgs } from "~/util/storybook/decorators";
import { Dialog, DialogContent } from ".";

interface StoryProps
  extends ComponentPropsWithoutRef<typeof Dialog>,
    DarkThemeDecoratorArgs {}

const meta = {
  title: "Components/Dialog",
  render: ({ dark, ...props }) => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    return (
      <DialogTrigger>
        <Button color="red">
          <Symbol slot="leading">delete</Symbol>
          Delete item
        </Button>
        <Dialog role="alertdialog" {...props}>
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
                <Button onPress={close} variant="elevated" color="red">
                  Delete
                </Button>
              </Toolbar>
            </>
          )}
        </Dialog>
      </DialogTrigger>
    );
  },
  parameters: {
    layout: "centered",
  },
  args: {
    isDismissable: false,
    isKeyboardDismissDisabled: false,
    dark: false,
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
