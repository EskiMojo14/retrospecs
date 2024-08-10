import { MDCTopAppBarFoundation } from "@material/top-app-bar";
import { useNavigate } from "@remix-run/react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AppBar, AppBarRow } from "~/components/app-bar";
import { Breadcrumb, Breadcrumbs } from "~/components/breadcrumbs";
import { ConfirmationDialog } from "~/components/dialog/confirmation";
import { IconButton } from "~/components/icon-button";
import { Link } from "~/components/link";
import { Symbol } from "~/components/symbol";
import { Toolbar } from "~/components/toolbar";
import { useIsomorphicLayoutEffect } from "~/hooks/use-isomorphic-layout-effect";
import { Invites } from "./invites/invites";
import { Logo } from "./logo";
import { PreferencesDialog } from "./user_config/dialog";
import styles from "./nav-bar.module.scss";

function useNavBarScroll() {
  const [navBarRef, setNavBarRef] = useState<HTMLElement | null>(null);
  const foundation = useMemo(() => {
    let foundation: MDCTopAppBarFoundation | null = null;
    if (!navBarRef) return foundation;
    foundation = new MDCTopAppBarFoundation({
      addClass: (className) => {
        navBarRef.classList.add(className);
      },
      removeClass: (className) => {
        navBarRef.classList.remove(className);
      },
      hasClass: (className) => navBarRef.classList.contains(className),
      setStyle: (property, value) => {
        navBarRef.style.setProperty(
          property === "top" ? "--top" : property,
          value,
        );
      },
      getTopAppBarHeight: () => {
        const height = navBarRef.clientHeight;
        navBarRef.style.setProperty("--app-bar-height", `${height}px`);
        return height;
      },
      getViewportScrollY: () => window.scrollY,
    });
    return foundation;
  }, [navBarRef]);

  useIsomorphicLayoutEffect(() => {
    if (!foundation) return;
    const ac = new AbortController();

    window.addEventListener(
      "scroll",
      foundation.handleTargetScroll.bind(foundation),
    );
    window.addEventListener(
      "resize",
      foundation.handleWindowResize.bind(foundation),
    );

    foundation.init();

    return () => {
      foundation.destroy();
      ac.abort();
    };
  }, [foundation]);

  return setNavBarRef;
}

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

export function NavBar({ breadcrumbs = [], actions }: NavBarProps) {
  const navBarRef = useNavBarScroll();
  const navigate = useNavigate();

  return (
    <AppBar ref={navBarRef} className={styles.navBar}>
      <AppBarRow className={styles.mainRow}>
        <Toolbar as="nav" slot="nav" aria-label="Breadcrumbs">
          <Logo />
          {
            <Breadcrumbs items={breadcrumbs}>
              {({ href, label, id = href }) => (
                <Breadcrumb id={id}>
                  <Link href={href}>{label}</Link>
                </Breadcrumb>
              )}
            </Breadcrumbs>
          }
        </Toolbar>
        <Toolbar slot="actions">
          {actions}
          <Invites />
          <ConfirmationDialog
            trigger={
              <IconButton slot="action" tooltip="Sign out">
                <Symbol>logout</Symbol>
              </IconButton>
            }
            title="Sign out"
            description="Are you sure you want to sign out?"
            confirmButtonProps={{
              children: "Sign out",
              color: "red",
            }}
            onConfirm={() => {
              navigate("/sign-out");
            }}
          />
          <PreferencesDialog />
        </Toolbar>
      </AppBarRow>
    </AppBar>
  );
}
