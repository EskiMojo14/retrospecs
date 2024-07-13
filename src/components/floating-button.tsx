import { forwardRef, ReactNode } from "react";
import { Button, ButtonProps } from "react-aria-components";
import clsx from "clsx";
import { Card } from "./card";
import "./floating-button.scss";

interface FloatingButtonProps extends Omit<ButtonProps, "children"> {
  label?: ReactNode;
  children: ReactNode;
}

export const FloatingButton = forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(({ children, label, className, ...props }, ref) => {
  return (
    <Card
      as={Button}
      ref={ref}
      {...props}
      type="inverse"
      className={clsx(
        "floating-button",
        label && "floating-button--extended",
        className
      )}
    >
      {children}
      {label && <span className="floating-button__label">{label}</span>}
    </Card>
  );
});

FloatingButton.displayName = "FloatingButton";
