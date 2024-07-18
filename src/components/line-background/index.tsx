import { bemHelper } from "@/util";
import "./index.scss";

const cls = bemHelper("line-background");

export function LineBackground({
  scale,
  className,
}: {
  scale?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cls({ extra: className })}
      style={{ "--scale": scale }}
    >
      <div className={cls("line", "vertical")} />
      <div className={cls("bottom-row")}>
        <div className={cls("corner")} />
        <div className={cls("line", "horizontal")} />
        <div className={cls("whorl")} />
        <div className={cls("line", "horizontal")} />
      </div>
    </div>
  );
}
