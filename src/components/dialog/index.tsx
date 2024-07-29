import type { ContextType } from "react";
import type {
  DialogProps as AriaDialogProps,
  ModalOverlayProps,
} from "react-aria-components";
import {
  Dialog as AriaDialog,
  DEFAULT_SLOT,
  HeadingContext,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { ButtonContext } from "~/components/button";
import { createGenericComponent } from "~/components/generic";
import { LineBackground } from "~/components/line-background";
import { MergeProvider, Provider } from "~/components/provider";
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

const headingContextValue: ContextType<typeof HeadingContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    title: { className: cls("title") },
  },
};

const toolbarContextValue: ContextType<typeof ToolbarContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    actions: { align: "end", className: cls("actions") },
  },
};

const emptyObj = {};

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
      className={overlayCls("modal", undefined, modalProps?.className)}
    >
      <AriaDialog {...props} className={cls({ extra: className })}>
        {renderPropsChild(children, (children) => (
          <MergeProvider context={HeadingContext} value={headingContextValue}>
            <Provider
              values={[
                [ToolbarContext, toolbarContextValue],
                // clear any influence we're getting from outside - dialogs are outside the tree
                // so they shouldn't inherit any context from the parent
                [ButtonContext, emptyObj],
              ]}
            >
              <LineBackground opacity={0.3}>{children}</LineBackground>
            </Provider>
          </MergeProvider>
        ))}
      </AriaDialog>
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
