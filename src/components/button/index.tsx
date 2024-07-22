import { mergeProps } from "@react-aria/utils";
import { clsx } from "clsx";
import type { ContextType, ReactNode } from "react";
import { createContext, forwardRef, useMemo } from "react";
import type {
  LinkProps,
  ContextValue,
  ToggleButtonProps as AriaToggleButtonProps,
  LabelProps,
  TextProps,
  ButtonProps as AriaButtonProps,
} from "react-aria-components";
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  DEFAULT_SLOT,
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
import { MergeProvider } from "~/components/provider";
import type { SymbolProps } from "~/components/symbol";
import { SymbolContext } from "~/components/symbol";
import type { TypographyProps } from "~/components/typography";
import { Typography } from "~/components/typography";
import { useRipple } from "~/hooks/use-ripple";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
import type { Overwrite } from "~/util/types";
import type { ButtonColor, ButtonVariant } from "./constants";
import "./index.scss";

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
    color,
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
          [color ?? ""]: !!color,
          compact: !!compact,
        },
        extra: className,
      })}
    >
      {renderGenericPropChild(rest, (children) => (
        <SymbolContext.Provider value={buttonSymbolSlots}>
          <div
            className={cls("ripple", { unbounded: !!unbounded })}
            {...surfaceProps}
          />
          <div className={cls("content")}>{children}</div>
        </SymbolContext.Provider>
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

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (props, ref) => <Button as={AriaToggleButton} {...props} ref={ref} />,
);

ToggleButton.displayName = "ToggleButton";

interface ButtonGroupProps
  extends Pick<ButtonProps, "color" | "variant" | "compact" | "isDisabled"> {
  orientation?: "horizontal" | "vertical";
  label?: ReactNode;
  labelProps?: Overwrite<LabelProps, TypographyProps>;
  description?: ReactNode;
  descriptionProps?: Overwrite<TextProps, TypographyProps>;
  children?: ReactNode;
  className?: string;
}

export const ButtonGroup = createGenericComponent<
  typeof Group,
  ButtonGroupProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  "ButtonGroup",
  Group,
  (
    {
      className,
      as: As,
      children,

      isDisabled,
      color,
      compact,
      variant,

      orientation = "horizontal",
      label,
      labelProps,
      description,
      descriptionProps,
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
        className={clsx("button-group", className)}
        data-orientation={orientation}
      >
        <Typography as={Label} variant="subtitle2" {...labelProps}>
          {label}
        </Typography>
        <ButtonContext.Provider value={contextValue}>
          <div className="button-group__buttons">{children}</div>
        </ButtonContext.Provider>
        {description && (
          <Typography
            as={Text}
            slot="description"
            variant="caption"
            {...descriptionProps}
          >
            {description}
          </Typography>
        )}
      </As>
    );
  },
);

export interface FloatingActionButtonProps
  extends Omit<Overwrite<AriaButtonProps, ButtonProps>, "variant"> {
  extended?: boolean;
  exited?: boolean;
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
>(({ className, extended, exited, children, ...props }, ref) => {
  return (
    <Button
      variant="filled"
      {...props}
      ref={ref}
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
});

FloatingActionButton.displayName = "FloatingActionButton";
