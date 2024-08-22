import { useParams } from "@remix-run/react";
import { useMemo } from "react";
import type { BaseSchema } from "valibot";
import { safeParse, ValiError } from "valibot";

export function useParsedParams<T extends BaseSchema<any, any, any>>(
  schema: T,
) {
  const params = useParams();
  const parseResult = useMemo(
    () => safeParse(schema, params),
    [params, schema],
  );
  if (!parseResult.success) {
    throw new ValiError(parseResult.issues);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return parseResult.output;
}
