import type { ReactNode } from "react";
import { bemHelper } from "~/util";
import type { BackgroundColor } from "./constants";
import "./index.scss";

const cls = bemHelper("line-background");

export function LineBackground({
  scale,
  color,
  className,
  children,
}: {
  scale?: number;
  color?: BackgroundColor;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className={cls({
          modifiers: { [color ?? ""]: !!color },
          extra: className,
        })}
        style={{ "--scale": scale }}
        dir="ltr"
      >
        <div className={cls("line", "vertical")} />
        <div className={cls("bottom-row")}>
          <div className={cls("corner")} />
          <div className={cls("line", "horizontal")} />
          <div className={cls("whorl")} />
          <div className={cls("line", "horizontal")} />
        </div>
      </div>
      <div className="line-background-content">{children}</div>
    </>
  );
}
