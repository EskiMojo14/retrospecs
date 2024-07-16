import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { GithubOAuthButton, GoogleOAuthButton, OAuthButton } from "./oauth";

const meta = {
  title: "Features/Auth/OAuthButton",
  component: OAuthButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {},
  args: { onPress: fn() },
} satisfies Meta<typeof OAuthButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Google: Story = {
  render: (args) => <GoogleOAuthButton {...args} />,
  argTypes: { logo: { table: { disable: true } } },
  args: { logo: null },
};

export const GitHub: Story = {
  render: (args) => <GithubOAuthButton {...args} />,
  argTypes: { logo: { table: { disable: true } } },
  args: { logo: null },
};
