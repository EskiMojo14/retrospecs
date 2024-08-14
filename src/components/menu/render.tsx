import type { ReactNode } from "react";
import { Collection, Header, Section } from "react-aria-components";
import type { DividerProps } from "~/components/divider";
import { Divider, DividerFragment } from "~/components/divider";
import { Typography } from "~/components/typography";
import type { MenuItemTextProps } from ".";
import { Menu, MenuItem, MenuItemText } from ".";

interface CommonItemProps {
  id: string;
  divider?: boolean | DividerProps["variant"];
  dividerProps?: Omit<DividerProps, keyof CommonItemProps>;
}

export interface StandardItem extends MenuItemTextProps, CommonItemProps {
  type?: "standard";
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
  const divider = item.divider && (
    <Divider
      {...item.dividerProps}
      variant={typeof item.divider === "string" ? item.divider : undefined}
    />
  );
  switch (item.type) {
    case "section":
      return (
        <DividerFragment id={item.id}>
          <Section>
            <Typography variant="subtitle2" as={Header}>
              {item.header}
            </Typography>
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
    default:
      return (
        <DividerFragment id={item.id}>
          <MenuItem>
            {item.leading}
            <MenuItemText label={item.label} description={item.description} />
            {item.trailing}
          </MenuItem>
          {divider}
        </DividerFragment>
      );
  }
}
