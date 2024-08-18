import type { ReactNode } from "react";
import { Fragment } from "react";
import type { Key } from "react-aria-components";

export const IdFragment = ({
  children,
  key,
}: {
  id: Key;
  key?: Key;
  children: ReactNode;
}) => <Fragment key={key}>{children}</Fragment>;
