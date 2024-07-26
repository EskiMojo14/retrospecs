import type { Enums } from "~/db/supabase";
import type { TuplifyUnion } from "~/util/types";

export type Color = Enums<"color">;

export const colors: TuplifyUnion<Color> = [
  "green",
  "blue",
  "orange",
  "amber",
  "gold",
  "teal",
  "pink",
] as const;
