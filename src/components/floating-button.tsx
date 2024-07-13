import { forwardRef, ReactNode } from "react";
import { Button, ButtonProps } from "react-aria-components";
import { Card } from "@/components/card";
import "./floating-button.scss";
import { bemHelper } from "@/util";

interface FloatingButtonProps
  extends Omit<ButtonProps, "children" | "className"> {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
}

const cls = bemHelper("floating-button");

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
      className={cls(
        undefined,
        {
          extended: !!label,
        },
        className,
      )}
    >
      {children}
      {label && <span className={cls("label")}>{label}</span>}
    </Card>
  );
});

FloatingButton.displayName = "FloatingButton";
