import type { ContextType, ReactNode } from "react";
import { forwardRef } from "react";
import type {
  SwitchProps as AriaSwitchProps,
  SwitchRenderProps,
} from "react-aria-components";
import { Switch as AriaSwitch } from "react-aria-components";
import { Symbol, SymbolContext } from "~/components/symbol";
import { useRipple } from "~/hooks/use-ripple";
import type { Color } from "~/theme/colors";
import { bemHelper, mergeRefs, renderPropsChild } from "~/util";
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
  ) => {
    const { rootRef, surfaceRef } = useRipple({
      disabled: props.isDisabled,
      unbounded: true,
    });
    return (
      <AriaSwitch
        {...props}
        ref={mergeRefs(ref, rootRef)}
        className={cls({
          extra: [className ?? "", "color-" + color],
        })}
      >
        {renderPropsChild(children, (children, renderProps) => {
          const currentIcon =
            typeof icon === "function" ? icon(renderProps) : icon;
          return (
            <>
              <div className={cls("track")}>
                <div
                  className={cls("handle-container", {
                    "has-icon": currentIcon != null && currentIcon !== false,
                  })}
                >
                  <div className={cls("ripple-container")}>
                    <div
                      ref={surfaceRef}
                      className={cls("ripple", "unbounded")}
                    />
                  </div>
                  <div className={cls("handle")}>
                    <SymbolContext.Provider value={symbolContextValue}>
                      <div className={cls("icon")}>{currentIcon}</div>
                    </SymbolContext.Provider>
                  </div>
                </div>
              </div>
              {children}
            </>
          );
        })}
      </AriaSwitch>
    );
  },
);

Switch.displayName = "Switch";
