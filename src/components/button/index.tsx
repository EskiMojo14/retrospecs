import { mergeProps } from "@react-aria/utils";
import type { ContextType, ReactNode } from "react";
import { createContext, forwardRef, useCallback, useMemo, useRef } from "react";
import type {
  ToggleButtonProps as AriaToggleButtonProps,
  ButtonProps as AriaButtonProps,
  LinkProps,
  ContextValue,
} from "react-aria-components";
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  DEFAULT_SLOT,
  FieldError,
  Group,
  Label,
  Link,
  Text,
  TextContext,
  useContextProps,
} from "react-aria-components";
import {
  createGenericComponent,
  renderGenericPropChild,
} from "~/components/generic";
import type { FormGroupProps } from "~/components/input/text-field";
import { MergeProvider } from "~/components/provider";
import type { SymbolProps } from "~/components/symbol";
import { SymbolContext } from "~/components/symbol";
import { Typography } from "~/components/typography";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonColor, ButtonVariant } from "./constants";
import "./index.scss";
import { useEventListener } from "~/hooks/use-event-listener";
import throttle from "lodash/throttle";

export interface ButtonProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
  compact?: boolean;
  isDisabled?: boolean;
  unbounded?: boolean;
}

const cls = bemHelper("button");

const sharedIconProps: SymbolProps = {
  size: 20,
};

const buttonSymbolSlots = {
  slots: {
    [DEFAULT_SLOT]: {},
    leading: { ...sharedIconProps, className: cls("icon", "leading") },
    trailing: { ...sharedIconProps, className: cls("icon", "trailing") },
  },
};

export const ButtonContext =
  createContext<ContextValue<ButtonProps, HTMLElement>>(null);

export const Button = createGenericComponent<
  typeof AriaButton,
  ButtonProps,
  {
    className: string;
    children: ReactNode;
  }
>("Button", AriaButton, (props, ref) => {
  let unbounded;
  [{ unbounded, ...props }, ref] = useContextProps(
    props,
    ref as never,
    ButtonContext,
  ) as [typeof props, typeof ref];
  const { surfaceProps, rootProps } = useRipple({
    disabled: props.isDisabled,
    unbounded,
  });
  const {
    variant = "text",
    color = "gold",
    compact,
    className,
    as: As,
    ref: rootRef,
    ...rest
  } = mergeProps(props, rootProps);
  return (
    <As
      {...rest}
      ref={mergeRefs(ref, rootRef as never)}
      className={cls({
        modifiers: {
          [variant]: true,
          [color]: true,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderGenericPropChild(rest, (children) => (
        <MergeProvider context={SymbolContext} value={buttonSymbolSlots}>
          <div
            className={cls("ripple", { unbounded: !!unbounded })}
            {...surfaceProps}
          />
          <div className={cls("content")}>{children}</div>
        </MergeProvider>
      ))}
    </As>
  );
});

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  Overwrite<LinkProps, ButtonProps>
>((props, ref) => <Button as={Link} {...props} ref={ref} />);

LinkButton.displayName = "LinkButton";

export type ToggleButtonProps = Overwrite<AriaToggleButtonProps, ButtonProps>;

const stateSymbolContexts: {
  [K in boolean as `${K}`]: SymbolProps & { fill: K };
} = {
  false: {
    transition: true,
    fill: false,
  },
  true: {
    transition: true,
    fill: true,
  },
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ children, ...props }, ref) => (
    <Button as={AriaToggleButton} {...props} ref={ref}>
      {(renderProps) => (
        <MergeProvider
          context={SymbolContext}
          value={stateSymbolContexts[`${renderProps.isSelected}`]}
        >
          {typeof children === "function" ? children(renderProps) : children}
        </MergeProvider>
      )}
    </Button>
  ),
);

ToggleButton.displayName = "ToggleButton";

interface ButtonGroupProps
  extends Pick<ButtonProps, "color" | "variant" | "compact" | "isDisabled">,
    FormGroupProps {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
  className?: string;
  id: string;
}

interface ButtonGroupPassedProps {
  className: string;
  children: ReactNode;
  id: string;
}

const clsGroup = bemHelper("button-group");

export const ButtonGroup = createGenericComponent<
  typeof Group,
  ButtonGroupProps,
  ButtonGroupPassedProps
>(
  "ButtonGroup",
  Group,
  (
    {
      className,
      as: As,
      children,
      id,

      isDisabled,
      color,
      compact,
      variant,

      orientation = "horizontal",
      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      errorMessageProps,

      ...props
    },
    ref,
  ) => {
    const contextValue = useMemo<ButtonProps>(
      () => ({ color, compact, isDisabled, variant }),
      [color, compact, isDisabled, variant],
    );

    return (
      <As
        ref={ref}
        {...props}
        className={clsGroup({
          extra: className,
        })}
        id={id}
        data-orientation={orientation}
      >
        <Typography
          as={Label}
          variant="subtitle2"
          id={`${id}-label`}
          {...labelProps}
          className={clsGroup({
            element: "label",
            extra: labelProps?.className,
          })}
        >
          {label}
        </Typography>
        <ButtonContext.Provider value={contextValue}>
          <section
            className={clsGroup("buttons")}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-describedby={description ? `${id}-description` : undefined}
          >
            {children}
          </section>
        </ButtonContext.Provider>
        {description && (
          <Typography
            as={Text}
            slot="description"
            variant="caption"
            id={`${id}-description`}
            {...descriptionProps}
            className={clsGroup({
              element: "description",
              extra: descriptionProps?.className,
            })}
          >
            {description}
          </Typography>
        )}
        <Typography as={FieldError} variant="caption" {...errorMessageProps}>
          {errorMessage}
        </Typography>
      </As>
    );
  },
);

export interface FloatingActionButtonProps
  extends Omit<Overwrite<AriaButtonProps, ButtonProps>, "variant"> {
  extended?: boolean;
  exited?: boolean;
  /** Defaults to true */
  exitOnScroll?: boolean;
}

const floatingCls = bemHelper("floating-action-button");

const textContextValue: ContextType<typeof TextContext> = {
  slots: {
    label: { className: floatingCls("label") },
  },
};

const symbolContextValue: ContextType<typeof SymbolContext> = {
  size: 24,
  weight: 400,
};

export const FloatingActionButton = forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(
  (
    { className, extended, exited, exitOnScroll = true, children, ...props },
    ref,
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const currentScroll = useRef(0);
    useEventListener(
      useCallback(() => window, []),
      "scroll",
      useMemo(
        () =>
          throttle(() => {
            // manually controlled
            if (typeof exited === "boolean") return;
            if (internalRef.current) {
              const newScroll = window.scrollY;
              const scrollDiff = newScroll - currentScroll.current;
              currentScroll.current = newScroll;
              const isExited = internalRef.current.classList.contains(
                "floating-action-button--scroll-exited",
              );
              if (scrollDiff > 0 && newScroll > 0 && !isExited) {
                internalRef.current.classList.add(
                  "floating-action-button--scroll-exited",
                );
              } else if ((scrollDiff < 0 || newScroll === 0) && isExited) {
                internalRef.current.classList.remove(
                  "floating-action-button--scroll-exited",
                );
              }
            }
          }, 500),
        [exited],
      ),
      { disabled: !exitOnScroll },
    );
    return (
      <Button
        variant="filled"
        {...props}
        ref={mergeRefs(ref, internalRef)}
        className={floatingCls({
          modifiers: {
            extended: !!extended,
            exited: !!exited,
          },
          extra: className,
        })}
        aria-hidden={exited}
      >
        {renderPropsChild(children, (children) => (
          <TextContext.Provider value={textContextValue}>
            <MergeProvider context={SymbolContext} value={symbolContextValue}>
              {children}
            </MergeProvider>
          </TextContext.Provider>
        ))}
      </Button>
    );
  },
);

FloatingActionButton.displayName = "FloatingActionButton";
