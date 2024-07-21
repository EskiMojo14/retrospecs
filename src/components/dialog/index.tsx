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
import {
  createGenericComponent,
  renderGenericPropChild,
} from "~/components/generic";
import { LineBackground } from "~/components/line-background";
import { MergeProvider } from "~/components/provider";
import { ToolbarContext } from "~/components/toolbar";
import { bemHelper } from "~/util";
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

export const Dialog = ({
  className,
  modalOverlayProps,
  modalProps,
  isDismissable,
  isKeyboardDismissDisabled,
  shouldCloseOnInteractOutside,
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
        {renderGenericPropChild(props, (children) => (
          <MergeProvider context={HeadingContext} value={headingContextValue}>
            <ToolbarContext.Provider value={toolbarContextValue}>
              <LineBackground className={cls("background")}>
                {children}
              </LineBackground>
            </ToolbarContext.Provider>
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
