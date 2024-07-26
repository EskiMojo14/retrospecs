import type { ReactNode } from "react";
import { createGenericComponent } from "~/components/generic";
import type { Enums } from "~/db/supabase";
import { bemHelper } from "~/util";
import "./index.scss";

export interface AvatarProps {
  src?: string | null;
  name: string;
  color: Enums<"color">;
  size?: "small" | "medium" | "large";
  className?: string;
}

export interface AvatarPassedProps {
  className: string;
  children: ReactNode;
  "aria-label": string;
}

const cls = bemHelper("avatar");

export const Avatar = createGenericComponent<
  "span",
  AvatarProps,
  AvatarPassedProps
>(
  "Avatar",
  "span",
  ({ as: As, src, name, size = "medium", color, className, ...props }, ref) => (
    <As
      {...props}
      ref={ref}
      className={cls({
        modifiers: [size, color],
        extra: className,
      })}
      aria-label={"Avatar for " + name}
    >
      {src ? <img src={src} aria-hidden /> : <span aria-hidden>{name[0]}</span>}
    </As>
  ),
);
