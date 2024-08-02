import type { ContextType, ReactNode } from "react";
import { DEFAULT_SLOT } from "react-aria-components";
import { ButtonContext } from "~/components/button";
import { Provider } from "~/components/provider";
import { ToolbarContext } from "~/components/toolbar";
import { LogoContext } from "~/features/logo";
import { bemHelper } from "~/util";
import "./index.scss";

export interface AppBarProps {
  children?: ReactNode;
  className?: string;
}

const cls = bemHelper("app-bar");

const toolbarContextValue: ContextType<typeof ToolbarContext> = {
  slots: {
    [DEFAULT_SLOT]: {
      className: cls("section"),
    },
    nav: {
      align: "start",
      className: cls("section", "nav"),
    },
    actions: {
      align: "end",
      className: cls("section", "actions"),
    },
  },
};

const logoContextValue: ContextType<typeof LogoContext> = {
  slots: {
    [DEFAULT_SLOT]: {
      className: cls("logo"),
    },
  },
};

const buttonContextValue: ContextType<typeof ButtonContext> = {
  slots: {
    [DEFAULT_SLOT]: {
      className: cls("action"),
    },
  },
};

export function AppBar({ children, className }: AppBarProps) {
  return (
    <header
      className={cls({
        extra: className,
      })}
    >
      <Provider
        values={[
          [ToolbarContext, toolbarContextValue],
          [LogoContext, logoContextValue],
          [ButtonContext, buttonContextValue],
        ]}
      >
        {children}
      </Provider>
    </header>
  );
}

export function AppBarRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cls({
        element: "row",
        extra: className,
      })}
    >
      {children}
    </div>
  );
}
