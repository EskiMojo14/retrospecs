import type { AriaToastProps } from "@react-aria/toast";
import { useToast } from "@react-aria/toast";
import type { ToastState } from "@react-stately/toast";
import type { ReactNode } from "react";
import { useMemo, useRef } from "react";
import { toastButtonColor, toastSymbols, type Toast } from "./constants";
import type { ButtonProps } from "@/components/button";
import { IconButton } from "@/components/icon-button";
import { Symbol } from "@/components/symbol";
import { Heading, Typography } from "@/components/typography";
import { bemHelper } from "@/util";

interface ToastProps extends AriaToastProps<Toast> {
  state: ToastState<Toast>;
}

const cls = bemHelper("toast");

export function Toast({ state, ...props }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { toastProps, titleProps, descriptionProps, closeButtonProps } =
    useToast(props, state, ref);
  const {
    content: {
      symbol,
      title,
      type,
      description,
      inverse,
      actions: actionsProp,
    },
  } = props.toast;
  const buttonProps = useMemo<ButtonProps>(
    () => ({
      color: toastButtonColor[type],
      inverse: !inverse,
    }),
    [type, inverse],
  );
  const actions = useMemo<ReactNode>(() => {
    if (!actionsProp) {
      return undefined;
    }
    if (typeof actionsProp === "function") {
      return actionsProp({
        close: () => {
          state.close(props.toast.key);
        },
        buttonProps,
      });
    }
    return actionsProp;
  }, [actionsProp, props.toast.key, state, buttonProps]);
  return (
    <div
      {...toastProps}
      ref={ref}
      className={cls({
        modifiers: {
          inverse: !!inverse,
          [type]: true,
        },
      })}
      data-animation={props.toast.animation}
      onAnimationEnd={() => {
        // Remove the toast when the exiting animation completes.
        if (props.toast.animation === "exiting") {
          state.remove(props.toast.key);
        }
      }}
    >
      <div className={cls("icon")}>
        {symbol ?? <Symbol>{toastSymbols[type]}</Symbol>}
      </div>
      <div className={cls("content")}>
        {title && (
          <Heading variant="subtitle1" className={cls("title")} {...titleProps}>
            {title}
          </Heading>
        )}
        <Typography
          variant="body2"
          className={cls("description")}
          {...descriptionProps}
        >
          {description}
        </Typography>
      </div>
      {actions ?? (
        <IconButton
          {...closeButtonProps}
          className={cls("close")}
          {...buttonProps}
          aria-label="Close toast"
        >
          <Symbol>close</Symbol>
        </IconButton>
      )}
    </div>
  );
}
