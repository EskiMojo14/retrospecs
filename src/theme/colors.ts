import type { Enums } from "~/db/supabase";

export type Color = Enums<"color">;

export const colors = [
  "green",
  "blue",
  "orange",
  "amber",
  "gold",
  "teal",
  "pink",
] as const satisfies Array<Color>;
