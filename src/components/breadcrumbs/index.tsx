import { clsx } from "clsx";
import { forwardRef } from "react";
import type { BreadcrumbsProps, BreadcrumbProps } from "react-aria-components";
import {
  Breadcrumbs as AriaBreadcrumbs,
  Breadcrumb as AriaBreadcrumb,
} from "react-aria-components";
import { Symbol } from "~/components/symbol";
import { bemHelper } from "~/util";
import "./index.scss";

export const Breadcrumbs = forwardRef<HTMLOListElement, BreadcrumbsProps<any>>(
  ({ className, ...props }, ref) => (
    <AriaBreadcrumbs
      ref={ref}
      {...props}
      className={clsx("breadcrumbs", className)}
    />
  ),
) as typeof AriaBreadcrumbs & { displayName?: string };

Breadcrumbs.displayName = "Breadcrumbs";

const cls = bemHelper("breadcrumb");

export const Breadcrumb = forwardRef<HTMLLIElement, BreadcrumbProps>(
  ({ className, children, ...props }, ref) => (
    <AriaBreadcrumb
      ref={ref}
      {...props}
      className={cls({
        extra: className,
      })}
    >
      {children}
      <Symbol flipRtl className={cls("icon")}>
        chevron_right
      </Symbol>
    </AriaBreadcrumb>
  ),
);

Breadcrumb.displayName = "Breadcrumb";
