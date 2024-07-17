import type { CSSProperties, ReactNode } from "react";
import { createGenericComponent } from "@/components/generic";
import { bemHelper, clamp, defaultNullish } from "@/util";
import "./index.scss";

interface SymbolSettings {
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** -25 (low emphasis) to 200 (high emphasis), defaults to 0 */
  grade?: number;
  /** 20px to 48px, defaults to `size` */
  opticalSize?: number;
}

const defaultSettings: Required<SymbolSettings> = {
  fill: false,
  weight: 400,
  grade: 0,
  opticalSize: 24,
};

const symbolSettingsToVar = (props: SymbolSettings) => {
  const { fill, weight, grade, opticalSize } = defaultNullish(
    props,
    defaultSettings,
  );
  return `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${clamp(grade, -25, 200)}, 'opsz' ${clamp(opticalSize, 20, 48)}`;
};

export interface SymbolProps extends SymbolSettings {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  /** defaults to 24 */
  size?: number;
  /** Set to `true` to use the default duration, or set a custom duration. */
  transition?: boolean | string;
}

export interface SymbolPassedProps {
  className: string;
  style: CSSProperties;
  children: ReactNode;
}

const cls = bemHelper("symbol");

export const Symbol = createGenericComponent<
  "i",
  SymbolProps,
  SymbolPassedProps
>(
  "Symbol",
  "i",
  (
    {
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
      ...props
    },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={cls(
        undefined,
        {
          transition: !!transition,
        },
        ["material-symbols-sharp", className ?? ""],
      )}
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
  ),
);
