import type { Meta, StoryObj } from "@storybook/react";
import { startCase } from "lodash";
import { Typography, typographyVariants } from "./typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: typographyVariants,
    },
    children: {
      control: "text",
    },
    as: {
      table: { disable: true },
    },
  },
  args: { children: "", variant: "headline1", as: undefined },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Some text",
  },
};

export const AllVariants: Story = {
  args: {},
  argTypes: {
    variant: { table: { disable: true } },
  },
  render: ({ children }) => (
    <>
      {typographyVariants.map((variant) => (
        <Typography
          key={variant}
          variant={variant}
          style={{
            margin: 0,
          }}
        >
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            children || startCase(variant)
          }
        </Typography>
      ))}
    </>
  ),
};
