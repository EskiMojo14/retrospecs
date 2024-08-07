import { clsx } from "clsx";
import type { ContextType } from "react";
import type {
  DialogProps as AriaDialogProps,
  ModalOverlayProps,
} from "react-aria-components";
import {
  Dialog as AriaDialog,
  DEFAULT_SLOT,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { createGenericComponent } from "~/components/generic";
import { LineBackground } from "~/components/line-background";
import { Provider } from "~/components/provider";
import { ToolbarContext } from "~/components/toolbar";
import { bemHelper, renderPropsChild } from "~/util";
import "./index.scss";

export interface DialogProps
  extends AriaDialogProps,
    Pick<
      ModalOverlayProps,
      | "isDismissable"
      | "isKeyboardDismissDisabled"
      | "shouldCloseOnInteractOutside"
    > {
  modalProps?: ModalOverlayProps & { className?: string };
  modalOverlayProps?: ModalOverlayProps & { className?: string };
}

const cls = bemHelper("dialog");
const overlayCls = bemHelper("dialog-overlay");

const toolbarContextValue: ContextType<typeof ToolbarContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    actions: { align: "end" },
  },
};

export const Dialog = ({
  className,
  modalOverlayProps,
  modalProps,
  isDismissable,
  isKeyboardDismissDisabled,
  shouldCloseOnInteractOutside,
  children,
  ...props
}: DialogProps) => (
  <ModalOverlay
    {...{
      isDismissable,
      isKeyboardDismissDisabled,
      shouldCloseOnInteractOutside,
    }}
    {...modalOverlayProps}
    className={overlayCls({ extra: modalOverlayProps?.className ?? "" })}
  >
    <Modal
      {...modalProps}
      className={clsx("dialog-modal", modalProps?.className)}
    >
      <LineBackground opacity={0.3}>
        <AriaDialog {...props} className={cls({ extra: className })}>
          {renderPropsChild(children, (children) => (
            <Provider values={[[ToolbarContext, toolbarContextValue]]}>
              {children}
            </Provider>
          ))}
        </AriaDialog>
      </LineBackground>
    </Modal>
  </ModalOverlay>
);

export const DialogContent = createGenericComponent<
  "div",
  { className?: string },
  { className: string }
>("DialogContent", "div", ({ as: As, className, ...props }, ref) => (
  <As ref={ref} {...props} className={cls("content", undefined, className)} />
));
