import { createGenericComponent } from "~/components/generic";
import { bemHelper } from "~/util";
import "./index.scss";

const cls = bemHelper("grid");

export const Grid = createGenericComponent<
  "div",
  { className?: string },
  { className: string }
>("Grid", "div", ({ as: As, className, ...props }, ref) => (
  <As {...props} ref={ref} className={cls({ extra: className })} />
));
