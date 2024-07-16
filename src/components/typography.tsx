import { createGenericComponent } from "./generic";
import { bemHelper } from "@/util";
import "./typography.scss";

export const typographyVariants = [
  "headline1",
  "headline2",
  "headline3",
  "headline4",
  "headline5",
  "headline6",
  "body1",
  "body2",
  "subtitle1",
  "subtitle2",
  "button",
  "overline",
  "caption",
] as const;

export type TypographyVariant = (typeof typographyVariants)[number];

export const variantMapping = {
  headline1: "h1",
  headline2: "h2",
  headline3: "h3",
  headline4: "h4",
  headline5: "h5",
  headline6: "h6",
  body1: "p",
  body2: "p",
  subtitle1: "h6",
  subtitle2: "h6",
  button: "span",
  overline: "p",
  caption: "p",
} as const;

export interface TypographyProps {
  variant: TypographyVariant;
  className?: string;
  children: React.ReactNode;
}

const cls = bemHelper("typography");

export const Typography = createGenericComponent<
  (typeof variantMapping)[keyof typeof variantMapping],
  TypographyProps,
  {
    className: string;
    children: React.ReactNode;
  }
>(
  { getComponent: ({ variant }) => variantMapping[variant] },
  ({ variant, className, as: As, ...props }, ref) => (
    <As ref={ref} {...props} className={cls(undefined, variant, className)} />
  ),
);

Typography.displayName = "Typography";
