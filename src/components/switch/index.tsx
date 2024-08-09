import type { ContextType, ReactNode } from "react";
import { forwardRef } from "react";
import type {
  SwitchProps as AriaSwitchProps,
  SwitchRenderProps,
} from "react-aria-components";
import { Switch as AriaSwitch } from "react-aria-components";
import { Symbol, SymbolContext } from "~/components/symbol";
import type { Color } from "~/theme/colors";
import { bemHelper, renderPropsChild } from "~/util";
import "./index.scss";

export interface SwitchProps extends Omit<AriaSwitchProps, "className"> {
  className?: string;
  color?: Color;
  icon?: ReactNode | ((props: SwitchRenderProps) => ReactNode);
}

const cls = bemHelper("switch");

const defaultIcon = ({ isSelected }: SwitchRenderProps) =>
  isSelected && <Symbol>check</Symbol>;

const symbolContextValue: ContextType<typeof SymbolContext> = { size: 16 };

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(
  (
    { className, children, color = "gold", icon = defaultIcon, ...props },
    ref,
  ) => (
    <AriaSwitch
      {...props}
      ref={ref}
      className={cls({
        modifiers: [color],
        extra: className,
      })}
    >
      {renderPropsChild(children, (children, renderProps) => {
        const currentIcon =
          typeof icon === "function" ? icon(renderProps) : icon;
        return (
          <>
            <div className={cls("track")}>
              <div
                className={cls("handle", {
                  "has-icon": currentIcon != null && currentIcon !== false,
                })}
              >
                <SymbolContext.Provider value={symbolContextValue}>
                  {currentIcon}
                </SymbolContext.Provider>
              </div>
            </div>
            {children}
          </>
        );
      })}
    </AriaSwitch>
  ),
);

Switch.displayName = "Switch";
