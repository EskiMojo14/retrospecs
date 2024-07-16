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

type GenericComponentProps<Component extends ElementType, Acc extends {} = {}> =
  Component extends GenericComponentInternal<
    infer DefaultComponent,
    infer ReceivedProps
  >
    ? GenericComponentProps<DefaultComponent, ReceivedProps & Acc>
    : Overwrite<ComponentPropsWithRef<Component>, Acc>;

interface GenericComponentInternal<
  DefaultComponent extends ElementType<PassedProps>,
  ReceivedProps extends {},
  PassedProps extends {} = {},
> {
  /** These are fake properties for inference, they will never exist in runtime */
  __GenericComponentTypes?: {
    DefaultComponent: DefaultComponent;
    ReceivedProps: ReceivedProps;
    PassedProps: PassedProps;
  };
}

export interface GenericComponent<
  DefaultComponent extends React.ElementType<PassedProps>,
  ReceivedProps extends {},
  PassedProps extends {} = {},
> extends GenericComponentInternal<
    DefaultComponent,
    ReceivedProps,
    PassedProps
  > {
  /** Allow passing a placeholder component (i.e. we are inside a generic component's render func) */
  (
    props: { as: PlaceholderComponent<PassedProps> } & GenericComponentProps<
      PlaceholderComponent<PassedProps>
    >,
  ): JSX.Element;
  /** Use a specified element, and inherit its props */
  <Component extends ElementType<PassedProps>>(
    props: { as: Component } & Overwrite<
      GenericComponentProps<Component>,
      ReceivedProps
    >,
  ): JSX.Element;
  /** Use the default element, and inherit its props */
  (
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    props: { as?: never } & Overwrite<
      GenericComponentProps<DefaultComponent>,
      ReceivedProps
    >,
  ): JSX.Element;
  displayName: string;
  readonly $$typeof: symbol;
}

export function createGenericComponent<
  DefaultComponent extends ElementType<PassedProps>,
  ReceivedProps extends {},
  PassedProps extends {} = {},
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
