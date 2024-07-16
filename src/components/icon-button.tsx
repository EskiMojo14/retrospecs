import clsx from "clsx";
import { forwardRef } from "react";
import type { ButtonProps } from "./button";
import { Button } from "./button";
import "./icon-button.scss";

export type IconButtonProps = ButtonProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => (
    <Button {...props} ref={ref} className={clsx("icon-button", className)} />
  ),
);

IconButton.displayName = "IconButton";
