import { forwardRef } from "react";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import { Link as AriaLink } from "react-aria-components";
import { bemHelper } from "~/util";
import "./index.scss";

export interface LinkProps extends AriaLinkProps {
  inverse?: boolean;
}

const cls = bemHelper("link");

export const Link = forwardRef<
  HTMLAnchorElement,
  LinkProps & { className?: string }
>(({ className, inverse, ...props }, ref) => (
  <AriaLink
    ref={ref}
    {...props}
    className={cls({
      modifiers: {
        inverse: !!inverse,
      },
      extra: className,
    })}
  />
));

Link.displayName = "Link";
