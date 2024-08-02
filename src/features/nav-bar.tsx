import type { ReactNode } from "react";
import { AppBar } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { LinkButton } from "~/components/button";
import { IconButton } from "~/components/icon-button";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { Logo } from "./logo";
import { PreferencesDialog } from "./user_config/dialog";

export interface NavItem {
  label: ReactNode;
  href: string;
  // defaults to href
  id?: string;
}

export interface NavBarProps {
  breadcrumbs?: Array<NavItem>;
  actions?: ReactNode;
}

export function NavBar({ breadcrumbs, actions }: NavBarProps) {
  return (
    <AppBar>
      <Toolbar as="nav" slot="nav">
        <Logo />
        <Breadcrumbs items={breadcrumbs}>
          {({ href, label, id = href }) => (
            <Breadcrumb id={id}>
              <Link href={href}>{label}</Link>
            </Breadcrumb>
          )}
        </Breadcrumbs>
      </Toolbar>
      <Toolbar slot="actions">
        {actions}
        <IconButton as={LinkButton} href="/sign-out" aria-label="Sign out">
          <Symbol>logout</Symbol>
        </IconButton>
        <PreferencesDialog />
      </Toolbar>
    </AppBar>
  );
}
