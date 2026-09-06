import type { Meta, StoryObj } from "@storybook/react";
import PromotionCarousel from "./PromotionCarousel";

const meta = {
  title: "Components/PromotionCarousel",
  component: PromotionCarousel,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof PromotionCarousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
