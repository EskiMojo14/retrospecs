import { forwardRef } from "react";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { Link as AriaLink } from "react-aria-components";
import { bemHelper } from "~/util";
import "./index.scss";

export type LinkProps = AriaLinkProps & { className?: string };

const cls = bemHelper("link");

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, ...props }, ref) => (
    <AriaLink
      ref={ref}
      {...props}
      className={cls({
        extra: className,
      })}
    />
  ),
);

Link.displayName = "Link";
