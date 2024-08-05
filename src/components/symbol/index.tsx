import type { CSSProperties, ReactNode } from "react";
import { createContext } from "react";
import type { SlotProps, ContextValue } from "react-aria-components";
import { useContextProps } from "react-aria-components";
import { createGenericComponent } from "~/components/generic";
import { bemHelper, clamp } from "~/util";
import "./index.scss";

export interface SymbolProps extends SlotProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;

  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** -25 (low emphasis) to 200 (high emphasis), defaults to 0 */
  grade?: number;
  /** 20px to 48px, defaults to `size` */
  opticalSize?: number;

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

export const SymbolContext =
  createContext<ContextValue<SymbolProps, HTMLElement>>(null);

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
        "--fill": fill ? 1 : 0,
        "--wght": weight,
        "--grad": grade && clamp(grade, -25, 200),
        "--opsz": clamp(opticalSize, 20, 48),
        "--transition-duration":
          typeof transition === "string" ? transition : undefined,
      }}
    >
      {children}
    </As>
  );
});
