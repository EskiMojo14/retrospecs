import { clsx } from "clsx";
import type { ContextType, ReactNode } from "react";
import { forwardRef } from "react";
import type {
  MenuProps as AriaMenuProps,
  MenuItemProps as AriaMenuItemProps,
  MenuTriggerProps as AriaMenuTriggerProps,
  SubmenuTriggerProps,
} from "react-aria-components";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  Text,
  MenuTrigger,
  SubmenuTrigger,
} from "react-aria-components";
import type { PopoverProps } from "~/components/popover";
import { Popover } from "~/components/popover";
import { Symbol, SymbolContext } from "~/components/symbol";
import { Typography } from "~/components/typography";
import { bemHelper, renderPropsChild } from "~/util";
import type { DistributiveOmit } from "~/util/types";
import "./index.scss";

type MenuTriggerProps =
  | {
      isSubMenu?: false;
      trigger: ReactNode;
      triggerProps?: Omit<AriaMenuTriggerProps, "children">;
    }
  | {
      isSubMenu: true;
      trigger: JSX.Element;
      triggerProps?: Omit<SubmenuTriggerProps, "children">;
    };

export type MenuProps<T extends object> = AriaMenuProps<T> &
  MenuTriggerProps & {
    variant?: "one-line" | "two-line";
    popoverProps?: DistributiveOmit<PopoverProps, "children">;
  };

const cls = bemHelper("menu");

export const Menu = forwardRef<HTMLDivElement, MenuProps<any>>(
  (
    {
      variant = "one-line",
      children,
      className,
      isSubMenu,
      trigger,
      triggerProps,
      popoverProps,
      ...props
    },
    ref,
  ) => {
    const popover = (
      <Popover
        offset={0}
        containerPadding={variant === "two-line" ? 64 : 56}
        {...popoverProps}
        className={clsx("menu-popover", popoverProps?.className)}
      >
        <AriaMenu
          {...props}
          ref={ref}
          className={cls({
            modifiers: {
              [variant]: true,
            },
            extra: className,
          })}
        >
          {children}
        </AriaMenu>
      </Popover>
    );
    return isSubMenu ? (
      <SubmenuTrigger {...triggerProps}>
        {trigger}
        {popover}
      </SubmenuTrigger>
    ) : (
      <MenuTrigger {...triggerProps}>
        {trigger}
        {popover}
      </MenuTrigger>
    );
  },
) as (<T extends object>(props: MenuProps<T>) => JSX.Element) & {
  displayName?: string;
};

Menu.displayName = "Menu";

const symbolContextValue: ContextType<typeof SymbolContext> = {
  slots: {
    leading: {
      className: cls("item-icon", "leading"),
    },
    trailing: {
      className: cls("item-icon", "trailing"),
    },
    check: {
      className: cls("item-icon", "check"),
    },
    submenu: {
      className: cls("item-icon", "submenu"),
    },
  },
};

interface MenuItemProps<T extends object>
  extends Omit<AriaMenuItemProps<T>, "className"> {
  className?: string;
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps<any>>(
  ({ children, className, ...props }, ref) => (
    <AriaMenuItem
      {...props}
      ref={ref}
      className={cls({
        element: "item",
        extra: className,
      })}
    >
      {renderPropsChild(children, (children, { isSelected, hasSubmenu }) => (
        <SymbolContext.Provider value={symbolContextValue}>
          {isSelected && <Symbol slot="check">check</Symbol>}
          {children}
          {hasSubmenu && (
            <Symbol slot="submenu" flipRtl>
              chevron_right
            </Symbol>
          )}
        </SymbolContext.Provider>
      ))}
    </AriaMenuItem>
  ),
) as (<T extends object>(props: MenuItemProps<T>) => JSX.Element) & {
  displayName?: string;
};

MenuItem.displayName = "MenuItem";

export interface MenuItemTextProps {
  label: ReactNode;
  description?: ReactNode;
}

export const MenuItemText = forwardRef<HTMLDivElement, MenuItemTextProps>(
  ({ label, description }, ref) => (
    <div ref={ref} className={cls("item-text")}>
      <Typography variant="body1" as={Text} slot="label">
        {label}
      </Typography>
      {description && (
        <Typography variant="caption" as={Text} slot="description">
          {description}
        </Typography>
      )}
    </div>
  ),
);

MenuItemText.displayName = "MenuItemText";
