import clsx from "clsx";
import { forwardRef } from "react";
import { Button, ButtonProps } from "react-aria-components";
import "./icon-button.scss";

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button
      {...props}
      ref={ref}
      className={clsx("icon-button", props.className)}
    />
  ),
);

IconButton.displayName = "IconButton";
