import type { PayloadAction } from "@reduxjs/toolkit";
import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";
import type { Meta, StoryObj } from "@storybook/react";
import { useReducer } from "react";
import type { Selection } from "react-aria-components";
import { Form, Text } from "react-aria-components";
import { Avatar } from "~/components/avatar";
import { Button } from "~/components/button";
import { Checkbox } from "~/components/checkbox";
import { Divider, DividerFragment } from "~/components/divider";
import { EmptyState } from "~/components/empty";
import { IconButton } from "~/components/icon-button";
import { Image } from "~/components/image";
import { TextField } from "~/components/input/text-field";
import { Switch } from "~/components/switch";
import { Symbol } from "~/components/symbol";
import { Heading } from "~/components/typography";
import { List, ListItem, ListItemText } from ".";
import styles from "./story.module.scss";

interface StoryProps {
  isDisabled: boolean;
  leading?:
    | "avatar"
    | "icon"
    | "image-square"
    | "image-rectangle"
    | "checkbox"
    | "switch";
  trailing?: "icon" | "text" | "checkbox" | "switch" | "icon-button";
  divider: "none" | "full" | "inset" | "middle";
}

function Leading({ leading }: Pick<StoryProps, "leading">) {
  switch (leading) {
    case "avatar":
      return <Avatar name="Avatar" />;
    case "icon":
      return <Symbol slot="icon">person</Symbol>;
    case "image-square":
      return <Image src="https://picsum.photos/300" aspectRatio="square" />;
    case "image-rectangle":
      return (
        <Image src="https://picsum.photos/300/200" aspectRatio="sixteen-nine" />
      );
    case "checkbox":
      return <Checkbox slot="selection" />;
    case "switch":
      return <Switch />;
    default:
      return null;
  }
}

function Trailing({ trailing }: Pick<StoryProps, "trailing">) {
  switch (trailing) {
    case "icon":
      return <Symbol slot="icon">chevron_right</Symbol>;
    case "text":
      return <Text slot="supporting">100+</Text>;
    case "checkbox":
      return <Checkbox slot="selection" />;
    case "switch":
      return <Switch />;
    case "icon-button":
      return (
        <IconButton tooltip="Edit">
          <Symbol>edit</Symbol>
        </IconButton>
      );
    default:
      return null;
  }
}

const meta = {
  title: "Components/List",
  argTypes: {
    leading: {
      control: "select",
      options: [
        undefined,
        "avatar",
        "icon",
        "image-square",
        "image-rectangle",
        "checkbox",
        "switch",
      ],
    },
    trailing: {
      control: "select",
      options: [undefined, "icon", "text", "checkbox", "switch", "icon-button"],
    },
    divider: {
      control: "select",
      options: ["none", "full", "inset", "middle"],
    },
  },
  args: {
    isDisabled: false,
    leading: undefined,
    divider: "none",
  },
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<StoryProps>;

const oneLineItems = [{ headline: "Headline" }, { headline: "Headline 2" }];

export const OneLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="one-line"
      items={oneLineItems}
      style={{
        background: "var(--surface)",
        minWidth: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const twoLineItems = [
  { headline: "Headline", supporting: "Supporting" },
  { headline: "Headline 2", supporting: "Supporting 2" },
];

export const TwoLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="two-line"
      items={twoLineItems}
      style={{
        background: "var(--surface)",
        minWidth: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting }) => (
        <DividerFragment id={headline}>
          <ListItem id={headline} isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} supporting={supporting} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In porta tellus vel nisl rhoncus, at dictum quam fringilla. Sed lobortis fringilla turpis, tempor aliquet nunc fringilla quis.";

const threeLineItems = [
  {
    headline: "Headline",
    supporting: loremIpsum,
  },
  {
    headline: "Headline 2",
    supporting: loremIpsum,
  },
];

export const ThreeLine: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="three-line"
      items={threeLineItems}
      style={{
        background: "var(--surface)",
        width: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText headline={headline} supporting={supporting} />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

const threeLineItemsWithOverline = [
  {
    headline: "Headline",
    supporting: loremIpsum,
    overline: "Overline",
  },
  {
    headline: "Headline 2",
    supporting: loremIpsum,
    overline: "Overline 2",
  },
];

export const ThreeLineWithOverline: Story = {
  render: ({ isDisabled, leading, trailing, divider }) => (
    <List
      variant="three-line"
      items={threeLineItemsWithOverline}
      style={{
        background: "var(--surface)",
        width: "256px",
      }}
      selectionMode={
        leading === "checkbox" || trailing === "checkbox" ? "single" : undefined
      }
      dependencies={[leading, trailing, isDisabled, divider]}
    >
      {({ headline, supporting, overline }) => (
        <DividerFragment id={headline}>
          <ListItem isDisabled={isDisabled}>
            <Leading leading={leading} />
            <ListItemText
              headline={headline}
              supporting={supporting}
              overline={overline}
            />
            <Trailing trailing={trailing} />
          </ListItem>
          {divider !== "none" && <Divider variant={divider} />}
        </DividerFragment>
      )}
    </List>
  ),
  args: {},
};

interface Todo {
  id: string;
  text: string;
}

const todoAdapter = createEntityAdapter<Todo>();

const { selectAll: selectAllTodos } = todoAdapter.getSelectors();

const todoSlice = createSlice({
  name: "todos",
  initialState: todoAdapter.getInitialState({
    completed: new Set<string>() as Selection,
  }),
  reducers: {
    todoAdded: {
      prepare: (text: string) => ({
        payload: {
          id: nanoid(),
          text,
        } satisfies Todo,
      }),
      reducer: todoAdapter.addOne,
    },
    todoRemoved: todoAdapter.removeOne,
    selectionChanged: (state, action: PayloadAction<Selection>) => {
      state.completed = action.payload;
    },
  },
});

const { todoAdded, todoRemoved } = todoSlice.actions;

function TodoListFn() {
  const [todos, dispatch] = useReducer(todoSlice.reducer, 0, () =>
    todoSlice.getInitialState(),
  );
  return (
    <section className={styles.todoList}>
      <section className={styles.section}>
        <Heading
          variant="subtitle1"
          className={styles.heading}
          id="todo-list-header"
        >
          Todo list
        </Heading>
        <List
          variant="one-line"
          items={selectAllTodos(todos)}
          selectionMode="multiple"
          renderEmptyState={() => (
            <EmptyState
              size="small"
              icon={
                <>
                  <Symbol className={styles.hideRtl}>checklist</Symbol>
                  <Symbol className={styles.hideLtr}>checklist_rtl</Symbol>
                </>
              }
              title="No todos"
              description="Use the form below to create one."
            />
          )}
          aria-labelledby="todo-list-header"
          className={styles.list}
        >
          {({ id, text }) => (
            <ListItem textValue={text} id={id}>
              <Checkbox slot="selection" />
              <ListItemText headline={text} />
              <IconButton
                tooltip="Delete"
                onPress={() => {
                  dispatch(todoRemoved(id));
                }}
              >
                <Symbol>delete</Symbol>
              </IconButton>
            </ListItem>
          )}
        </List>
      </section>
      <Divider variant="middle" />
      <section className={styles.section}>
        <Heading
          variant="subtitle1"
          className={styles.heading}
          id="add-todo-title"
        >
          Add todo
        </Heading>
        <Form
          onSubmit={(e) => {
            const form = e.currentTarget;
            e.preventDefault();
            const text = new FormData(form).get("text") as string;
            dispatch(todoAdded(text));
            form.reset();
          }}
          className={styles.form}
          aria-labelledby="add-todo-title"
        >
          <TextField label="Text" name="text" isRequired />
          <Button variant="elevated" type="submit">
            <Symbol>add</Symbol>
            Add
          </Button>
        </Form>
      </section>
    </section>
  );
}

export const TodoList: Story = {
  render: TodoListFn,
  argTypes: {
    isDisabled: { table: { disable: true } },
    leading: { table: { disable: true } },
    trailing: { table: { disable: true } },
    divider: { table: { disable: true } },
  },
  args: {},
};
