import type { ReactNode } from "react";
import type { ButtonProps as AriaButtonProps } from "react-aria-components";
import type { ButtonProps } from "~/components/button";
import { Button } from "~/components/button";
import { Toolbar } from "~/components/toolbar";
import { Heading, Typography } from "~/components/typography";
import type { Overwrite } from "~/util/types";
import type { DialogProps } from ".";
import { Dialog, DialogContent } from ".";

export interface ConfirmationDialogProps extends Omit<DialogProps, "children"> {
  title: string;
  description: string;
  onConfirm: (close: () => void) => void;
  onCancel?: () => void;
  confirmButtonProps?: Overwrite<AriaButtonProps, ButtonProps>;
  cancelButtonProps?: Overwrite<AriaButtonProps, ButtonProps>;
  children?: ReactNode;
}

export function ConfirmationDialog({
  title,
  description,
  onConfirm,
  onCancel,
  confirmButtonProps,
  cancelButtonProps,
  children,
  ...props
}: ConfirmationDialogProps) {
  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading variant="headline6" slot="title">
            {title}
          </Heading>
          <DialogContent slot="content">
            {children ?? <Typography variant="body2">{description}</Typography>}
          </DialogContent>
          <Toolbar slot="actions">
            <Button
              onPress={() => {
                onCancel?.();
                close();
              }}
              variant="outlined"
              {...cancelButtonProps}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                onConfirm(close);
              }}
              variant="elevated"
              {...confirmButtonProps}
            >
              Confirm
            </Button>
          </Toolbar>
        </>
      )}
    </Dialog>
  );
}
