import { mergeProps } from "@react-aria/utils";
import type { ComponentPropsWithoutRef, ContextType, ReactNode } from "react";
import { createContext, forwardRef, useMemo } from "react";
import type {
  GridListItemProps,
  GridListProps,
  ContextValue,
} from "react-aria-components";
import {
  DEFAULT_SLOT,
  GridList,
  GridListItem,
  useContextProps,
  TextContext,
  useSlottedContext,
  Text,
} from "react-aria-components";
import { MergeProvider } from "~/components/provider";
import { SymbolContext } from "~/components/symbol";
import { bemHelper, renderPropsChild } from "~/util";
import "./index.scss";

const cls = bemHelper("list");

export interface ListProps<T> extends Omit<GridListProps<T>, "className"> {
  variant: "one-line" | "two-line" | "three-line";
  nonInteractive?: boolean;
  className?: string;
}

type ListItemContextValue = ContextValue<
  Pick<ListItemProps<any>, "nonInteractive">,
  HTMLElement
>;

export const ListItemContext = createContext<ListItemContextValue>(null);

export const List = forwardRef<HTMLDivElement, ListProps<any>>(
  ({ variant, nonInteractive, className, ...props }, ref) => {
    const listItemContextValue = useMemo<ListItemContextValue>(
      () => ({ nonInteractive }),
      [nonInteractive],
    );
    return (
      <ListItemContext.Provider value={listItemContextValue}>
        <GridList
          ref={ref}
          {...props}
          className={cls({
            modifier: variant,
            extra: className,
          })}
        />
      </ListItemContext.Provider>
    );
  },
) as (<T>(props: ListProps<T>) => JSX.Element) & { displayName?: string };

List.displayName = "List";

export interface ListItemProps<T>
  extends Omit<GridListItemProps<T>, "className"> {
  nonInteractive?: boolean;
  className?: string;
}

const symbolContextValue: ContextType<typeof SymbolContext> = {
  slots: {
    [DEFAULT_SLOT]: {},
    icon: { className: cls("icon") },
  },
};

const ListItemProvider = ({ children }: { children: ReactNode }) => {
  const descriptionProps = useSlottedContext(TextContext, "description");
  const textContextValue = useMemo<ContextType<typeof TextContext>>(
    () => ({
      slots: {
        [DEFAULT_SLOT]: {},
        overline: { className: cls("text", "overline") },
        headline: mergeProps(descriptionProps, {
          className: cls("text", "headline"),
        }),
        supporting: { className: cls("text", "supporting") },
      },
    }),
    [descriptionProps],
  );
  return (
    <MergeProvider context={TextContext} value={textContextValue}>
      <SymbolContext.Provider value={symbolContextValue}>
        {children}
      </SymbolContext.Provider>
    </MergeProvider>
  );
};

export const ListItem = forwardRef<HTMLDivElement, ListItemProps<any>>(
  (props, ref) => {
    [props, ref] = useContextProps(props, ref as never, ListItemContext) as [
      typeof props,
      typeof ref,
    ];
    const { nonInteractive, className, children, ...rest } = props;
    return (
      <GridListItem
        ref={ref}
        {...rest}
        className={cls({
          element: "item",
          modifiers: {
            "non-interactive": !!nonInteractive,
          },
          extra: className,
        })}
      >
        {renderPropsChild(children, (children) => (
          <ListItemProvider>{children}</ListItemProvider>
        ))}
      </GridListItem>
    );
  },
) as (<T>(props: ListItemProps<T>) => JSX.Element) & { displayName?: string };

ListItem.displayName = "ListItem";

interface ListItemTextProps
  extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  headline: ReactNode;
  overline?: ReactNode;
  supporting?: ReactNode;
}

export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(
  ({ className, overline, headline, supporting, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      className={cls({
        element: "item-text",
        modifiers: {
          "no-overline": !overline,
        },
        extra: className,
      })}
    >
      {overline && <Text slot="overline">{overline}</Text>}
      <Text slot="headline">{headline}</Text>
      {supporting && <Text slot="supporting">{supporting}</Text>}
    </div>
  ),
);

ListItemText.displayName = "ListItemText";
