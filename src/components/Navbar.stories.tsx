import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "./Navbar";
import { MemoryRouter } from "react-router";
import { SiteProvider } from "../store/site";
import { CartProvider } from "../store/cart";
import { products } from "../data/products";
import { categories } from "../data/categories";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <SiteProvider
          initialCatalog={{
            products,
            categories,
            pickupLocations: [],
            promotions: [],
          }}
        >
          <CartProvider>
            <Story />
          </CartProvider>
        </SiteProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
