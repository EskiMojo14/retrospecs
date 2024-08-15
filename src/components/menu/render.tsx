import type { ReactNode } from "react";
import type { Key } from "react-aria-components";
import { Collection, Section } from "react-aria-components";
import type { DividerProps } from "~/components/divider";
import { Divider, DividerFragment } from "~/components/divider";
import { Header } from "~/components/typography";
import type { MenuItemTextProps, MenuItemProps } from ".";
import { Menu, MenuItem, MenuItemText } from ".";

interface CommonItemProps {
  id: Key;
  divider?: true | DividerProps["variant"] | DividerProps;
}

export interface StandardItem
  extends MenuItemTextProps,
    CommonItemProps,
    Omit<MenuItemProps<never>, "children" | "id"> {
  type?: never;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export interface SubmenuItem extends MenuItemTextProps, CommonItemProps {
  type: "submenu";
  leading?: ReactNode;
  children: Array<MenuItem>;
  variant?: "one-line" | "two-line";
}

export interface SectionItem extends CommonItemProps {
  type: "section";
  header: ReactNode;
  children: Array<MenuItem>;
}

export type MenuItem = StandardItem | SubmenuItem | SectionItem;

export function renderMenuItem(item: MenuItem): JSX.Element {
  const dividerProps =
    item.divider &&
    (typeof item.divider === "object"
      ? item.divider
      : {
          variant: typeof item.divider === "string" ? item.divider : undefined,
        });
  const divider = dividerProps && <Divider {...dividerProps} />;
  switch (item.type) {
    case "section":
      return (
        <DividerFragment id={item.id}>
          <Section>
            <Header variant="subtitle2">{item.header}</Header>
            <Collection items={item.children}>{renderMenuItem}</Collection>
          </Section>
          {divider}
        </DividerFragment>
      );
    case "submenu":
      return (
        <DividerFragment id={item.id}>
          <Menu
            variant={item.variant}
            items={item.children}
            isSubMenu
            trigger={
              <MenuItem>
                {item.leading}
                <MenuItemText
                  label={item.label}
                  description={item.description}
                />
              </MenuItem>
            }
          >
            {renderMenuItem}
          </Menu>
          {divider}
        </DividerFragment>
      );
    default: {
      const { leading, trailing, label, description, ...itemProps } = item;
      return (
        <DividerFragment id={item.id}>
          <MenuItem {...itemProps}>
            {leading}
            <MenuItemText label={label} description={description} />
            {trailing}
          </MenuItem>
          {divider}
        </DividerFragment>
      );
    }
  }
}
