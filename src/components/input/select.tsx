import type { ContextType, ReactNode } from "react";
import type {
  FieldErrorProps,
  ListBoxItemProps,
  SelectProps,
  TextProps,
  ValidationResult,
  LabelProps,
  SelectValueRenderProps,
} from "react-aria-components";
import {
  Label,
  Select as AriaSelect,
  Button,
  SelectValue,
  ListBox,
  ListBoxItem,
  FieldError,
  Text,
} from "react-aria-components";
import { Popover } from "~/components/popover";
import type { SymbolProps } from "~/components/symbol";
import { Symbol, SymbolContext } from "~/components/symbol";
import type { TypographyProps } from "~/components/typography";
import { Typography } from "~/components/typography";
import { bemHelper, renderPropsChild } from "~/util";
import type { Overwrite } from "~/util/types";
import { inputGroupCls } from ".";
import "./index.scss";
import { Color } from "~/theme/colors";

interface MySelectProps<T extends object>
  extends Omit<SelectProps<T>, "children" | "className"> {
  className?: string;
  label?: ReactNode;
  labelProps?: Overwrite<LabelProps, Partial<TypographyProps>>;
  description?: ReactNode;
  descriptionProps?: Overwrite<TextProps, Partial<TypographyProps>>;
  errorMessage?: ReactNode | ((validation: ValidationResult) => ReactNode);
  errorMessageProps?: Overwrite<FieldErrorProps, Partial<TypographyProps>>;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  renderSelected?: (
    item: SelectValueRenderProps<T> & { defaultChildren?: ReactNode },
  ) => React.ReactNode;
  icon?: ReactNode;
  color?: Color;
}

const cls = bemHelper("select");

const symbolContextValue: ContextType<typeof SymbolContext> = {
  className: inputGroupCls("icon"),
};

export function Select<T extends object>({
  label,
  labelProps,
  description,
  descriptionProps,
  errorMessage,
  errorMessageProps,
  children,
  items,
  className,
  icon,
  renderSelected,
  color = "gold",
  ...props
}: MySelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={inputGroupCls({
        extra: cls({ extra: [className ?? "", "color-" + color] }),
      })}
    >
      {label && (
        <Typography
          as={Label}
          variant="subtitle2"
          {...labelProps}
          className={inputGroupCls({
            element: "label",
            extra: labelProps?.className,
          })}
        >
          {label}
        </Typography>
      )}
      <Button className={inputGroupCls("input-container")}>
        <SymbolContext.Provider value={symbolContextValue}>
          {icon}
          <SelectValue className={cls("select-value")}>
            {renderSelected}
          </SelectValue>
        </SymbolContext.Provider>
        <Symbol className={cls("dropdown-icon")}>arrow_drop_down</Symbol>
      </Button>
      {description && (
        <Typography
          as={Text}
          variant="caption"
          slot="description"
          {...descriptionProps}
          className={inputGroupCls({
            element: "description",
            extra: descriptionProps?.className,
          })}
        >
          {description}
        </Typography>
      )}
      <Typography
        as={FieldError}
        variant="body2"
        {...errorMessageProps}
        className={inputGroupCls({
          element: "error-message",
          extra: errorMessageProps?.className,
        })}
      >
        {errorMessage}
      </Typography>
      <Popover
        offset={0}
        className={cls({
          element: "popover",
          extra: "color-" + color,
        })}
      >
        <ListBox items={items} className={cls("listbox")}>
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

const symbolContextStates: {
  [K in boolean as `${K}`]: SymbolProps & { fill: K };
} = {
  true: {
    className: inputGroupCls("icon"),
    transition: "50ms",
    fill: true,
  },
  false: {
    className: inputGroupCls("icon"),
    transition: "50ms",
    fill: false,
  },
};

export function SelectItem<T extends object>({
  children,
  className,
  ...props
}: Omit<ListBoxItemProps<T>, "className"> & { className?: string }) {
  return (
    <ListBoxItem
      {...props}
      className={cls({
        element: "item",
        extra: className,
      })}
    >
      {renderPropsChild(children, (children, { isSelected }) => (
        <SymbolContext.Provider value={symbolContextStates[`${isSelected}`]}>
          {children}
        </SymbolContext.Provider>
      ))}
    </ListBoxItem>
  );
}
