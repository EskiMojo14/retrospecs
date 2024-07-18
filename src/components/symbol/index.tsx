import type { CSSProperties, ReactNode } from "react";
import { createContext } from "react";
import type { SlotProps, ContextValue } from "react-aria-components";
import { useContextProps } from "react-aria-components";
import type { SymbolSettings } from "./constants";
import { defaultSettings } from "./constants";
import { createGenericComponent } from "@/components/generic";
import { bemHelper, clamp, defaultNullish } from "@/util";
import "./index.scss";

const symbolSettingsToVar = (props: SymbolSettings) => {
  const { fill, weight, grade, opticalSize } = defaultNullish(
    props,
    defaultSettings,
  );
  return `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${clamp(grade, -25, 200)}, 'opsz' ${clamp(opticalSize, 20, 48)}`;
};

export interface SymbolProps extends SymbolSettings, SlotProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** defaults to 24 */
  size?: number;
  /** Set to `true` to use the default duration, or set a custom duration. */
  transition?: boolean | string;
  /** Whether the icon should be flipped vertically in RTL */
  flipRtl?: boolean;
}

export interface SymbolPassedProps {
  className: string;
  style: CSSProperties;
  children: ReactNode;
}

const cls = bemHelper("symbol");

export const SymbolContext = createContext<
  ContextValue<SymbolProps, HTMLElement>
>({});

export const Symbol = createGenericComponent<
  "i",
  SymbolProps,
  SymbolPassedProps
>("Symbol", "i", (props, ref) => {
  [props, ref] = useContextProps(props, ref as never, SymbolContext) as [
    typeof props,
    typeof ref,
  ];
  const {
    fill,
    weight,
    grade,
    size = 24,
    opticalSize = size,
    as: As,
    style,
    children,
    className,
    transition,
    flipRtl,
    ...rest
  } = props;
  return (
    <As
      ref={ref}
      aria-hidden
      {...rest}
      className={cls({
        modifiers: {
          transition: !!transition,
          "flip-rtl": !!flipRtl,
        },
        extra: ["material-symbols-sharp", className ?? ""],
      })}
      style={{
        ...style,
        fontSize: `${size}px`,
        "--variation-settings": symbolSettingsToVar({
          fill,
          weight,
          grade,
          opticalSize,
        }),
        "--transition-duration":
          typeof transition === "string" ? transition : undefined,
      }}
    >
      {children}
    </As>
  );
});
