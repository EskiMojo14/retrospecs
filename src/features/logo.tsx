import { clsx } from "clsx";
import type { ReactNode } from "react";
import { createGenericComponent } from "@/components/generic";
// eslint-disable-next-line import/no-unresolved
import logo from "/assets/retrospecs.png";
import { Typography } from "@/components/typography";
import styles from "./logo.module.scss";

interface LogoProps {
  className?: string;
}

interface LogoPassedProps {
  className: string;
  children: ReactNode;
}

export const Logo = createGenericComponent<"div", LogoProps, LogoPassedProps>(
  "Logo",
  "div",
  ({ as: As, className, ...props }, ref) => (
    <As ref={ref} {...props} className={clsx(styles.logo, className)}>
      <img src={logo} alt="RetroSpecs" />
      <Typography variant="headline5" className={styles.wordmark}>
        RetroSpecs
      </Typography>
    </As>
  ),
);

Logo.displayName = "Logo";
