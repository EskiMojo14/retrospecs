import type {
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  ForwardedRef,
  Ref,
} from "react";
import { forwardRef } from "react";
import type { Overwrite } from "@/util/types";

const propSymbol = Symbol("prop");
const refSymbol = Symbol("ref");

type PlaceholderComponent<PassedProps> = ComponentType<
  PassedProps & { [propSymbol]: true; ref: Ref<typeof refSymbol> }
>;

/** To make sure all props and the ref is passed through, we fake some types here */
type GenericRenderFunction<RecievedProps, PassedProps> = (
  props: RecievedProps & { as: PlaceholderComponent<PassedProps> } & {
    [propSymbol]: true;
  },
  ref: ForwardedRef<typeof refSymbol>,
) => JSX.Element;

export interface GenericComponent<
  DefaultComponent extends React.ElementType<PassedProps>,
  ReceivedProps,
  PassedProps = {},
> {
  (
    props:
      | ({ as?: never } & Overwrite<
          ComponentPropsWithRef<DefaultComponent>,
          ReceivedProps
        >)
      | ({ as: PlaceholderComponent<PassedProps> } & ComponentPropsWithRef<
          PlaceholderComponent<PassedProps>
        >),
  ): JSX.Element;
  <Component extends ElementType<PassedProps>>(
    props: { as: Component } & Overwrite<
      ComponentPropsWithRef<Component>,
      ReceivedProps
    >,
  ): JSX.Element;
  displayName: string;
  readonly $$typeof: symbol;
}

export function createGenericComponent<
  DefaultComponent extends ElementType<PassedProps>,
  ReceivedProps,
  PassedProps = {},
>(
  defaultComponent:
    | DefaultComponent
    | { getComponent: (props: ReceivedProps) => DefaultComponent },
  render: GenericRenderFunction<ReceivedProps, PassedProps>,
): GenericComponent<DefaultComponent, ReceivedProps, PassedProps> {
  return forwardRef<typeof refSymbol, { as?: ElementType } & ReceivedProps>(
    function intermediate({ as = defaultComponent, ...props }, ref) {
      if (typeof as === "object" && "getComponent" in as) {
        as = as.getComponent(props as never);
      }
      return render({ ...props, as } as never, ref);
    },
  ) as never;
}
