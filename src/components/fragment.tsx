import type { ReactNode } from "react";
import { Fragment } from "react";
import type { Key } from "react-aria-components";

export const IdFragment = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id: _id,
  ...props
}: {
  id: Key;
  children: ReactNode;
}) => <Fragment {...props} />;
