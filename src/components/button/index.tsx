import type { CollectionProps } from "@react-aria/collections";
import { mergeProps } from "@react-aria/utils";
import type { ReactNode } from "react";
import { createContext, forwardRef, useCallback, useMemo, useRef } from "react";
import type {
  ToggleButtonProps as AriaToggleButtonProps,
  LinkProps,
  ContextValue,
  SlotProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  Collection,
  DEFAULT_SLOT,
  FieldError,
  Group,
  Label,
  Link,
  Text,
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
import { Toolbar } from "~/components/toolbar";
import { Typography } from "~/components/typography";
import { useEventListener } from "~/hooks/use-event-listener";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonColor, ButtonVariant } from "./constants";
import "./index.scss";

export interface ButtonProps extends SlotProps {
  variant?: ButtonVariant;
  className?: string;
  color?: ButtonColor;
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
    weight: 600,
  },
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ children, ...props }, ref) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    useEventListener(
      innerRef,
      "mouseleave",
      useCallback(() => {
        innerRef.current?.classList.remove("toggle-button--changed");
      }, []),
    );
    return (
      <Button
        as={AriaToggleButton}
        {...mergeProps(props, {
          ref: mergeRefs(ref, innerRef),
          onChange(isSelected: boolean) {
            innerRef.current?.classList[isSelected ? "add" : "remove"](
              "toggle-button--changed",
            );
          },
        })}
      >
        {renderPropsChild(children, (children, { isSelected }) => (
          <MergeProvider
            context={SymbolContext}
            value={stateSymbolContexts[`${isSelected}`]}
          >
            {children}
          </MergeProvider>
        ))}
      </Button>
    );
  },
);

ToggleButton.displayName = "ToggleButton";

export interface ButtonGroupProps<T extends object>
  extends Pick<ButtonProps, "color" | "variant" | "isDisabled">,
    FormGroupProps,
    Pick<CollectionProps<T>, "items" | "children" | "dependencies"> {
  orientation?: "horizontal" | "vertical";
  className?: string;
  id: string;
}

const clsGroup = bemHelper("button-group");

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps<{}>>(
  (
    {
      className,
      children,
      id,

      isDisabled,
      color,
      variant,

      orientation = "horizontal",
      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      errorMessageProps,

      items,
      dependencies,

      ...props
    },
    ref,
  ) => {
    const contextValue = useMemo<ButtonProps>(
      () => ({ color, isDisabled, variant }),
      [color, isDisabled, variant],
    );

    return (
      <Group
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
          <Toolbar
            className={clsGroup("buttons")}
            aria-labelledby={label ? `${id}-label` : undefined}
            aria-describedby={description ? `${id}-description` : undefined}
          >
            <Collection
              {...{
                items,
                dependencies,
              }}
            >
              {children}
            </Collection>
          </Toolbar>
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
      </Group>
    );
  },
) as (<T extends object>(props: ButtonGroupProps<T>) => JSX.Element) & {
  displayName: string;
};

ButtonGroup.displayName = "ButtonGroup";
