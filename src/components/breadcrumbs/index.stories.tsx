import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "~/components/link";
import { Breadcrumbs, Breadcrumb } from ".";

interface StoryProps {
  dir?: "rtl" | "ltr";
}

const meta = {
  title: "Components/Breadcrumbs",
  render: ({ dir }) => (
    <div dir={dir}>
      <Breadcrumbs>
        <Breadcrumb>
          <Link href="/">Home</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="/products">Products</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link href="/products/123">Product 123</Link>
        </Breadcrumb>
      </Breadcrumbs>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
  argTypes: {
    dir: {
      control: {
        type: "inline-radio",
      },
      options: ["ltr", "rtl"],
    },
  },
  args: {
    dir: "ltr",
  },
  decorators: [],
} satisfies Meta<StoryProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
