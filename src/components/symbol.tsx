import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import { createGenericComponent } from "./generic";
import { clamp } from "@/util";
import "./symbol.scss";

interface SymbolSettings {
  fill?: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** -25 (low emphasis) to 200 (high emphasis), defaults to 0 */
  grade?: number;
  /** defaults to 24 */
  size?: number;
  /** 20px to 48px, defaults to `size` */
  opticalSize?: number;
}

const defaultSettings: Required<SymbolSettings> = {
  fill: false,
  weight: 400,
  grade: 0,
  size: 24,
  opticalSize: 24,
};

const symbolSettingsToVar = ({
  fill = defaultSettings.fill,
  weight = defaultSettings.weight,
  grade = defaultSettings.grade,
  opticalSize = defaultSettings.opticalSize,
}: Omit<SymbolSettings, "size">) => {
  return `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${clamp(grade, -25, 200)}, 'opsz' ${clamp(opticalSize, 20, 48)}`;
};

export interface SymbolProps extends SymbolSettings {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

export interface SymbolPassedProps {
  className: string;
  style: CSSProperties;
  children: ReactNode;
}

export const Symbol = createGenericComponent<
  "i",
  SymbolProps,
  SymbolPassedProps
>(
  "i",
  (
    {
      fill,
      weight,
      grade,
      size = defaultSettings.size,
      opticalSize = size,
      as: As,
      style,
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <As
      ref={ref}
      {...props}
      className={clsx("material-symbols-sharp symbol", className)}
      style={{
        ...style,
        fontSize: `${size}px`,
        "--variation-settings": symbolSettingsToVar({
          fill,
          weight,
          grade,
          opticalSize,
        }),
      }}
    >
      {children}
    </As>
  ),
);

Symbol.displayName = "Symbol";
