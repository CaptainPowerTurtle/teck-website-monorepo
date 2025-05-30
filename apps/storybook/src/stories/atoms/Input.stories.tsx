import type { Meta, StoryObj } from "@storybook/react";

import { Input } from "@repo/ui/components/ui/input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  argTypes: {
    placeholder: {
      description: "Input placeholder text",
      control: "text",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: undefined },
      },
    },
    disabled: {
      description: "A disabled input is unusable and un-clickable",
      control: "boolean",
      table: {
        category: "State",
        type: { summary: "boolean" },
        defaultValue: { summary: "" },
      },
    },
    className: {
      description: "Override or extend the styles applied to the component",
      control: "text",
      table: {
        category: "Override/extend",
        type: { summary: "string" },
        defaultValue: { summary: "" },
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "My input placeholder",
  },
};
