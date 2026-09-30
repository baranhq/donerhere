import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { Product } from "../data/products";

type CartItem = {
  product: Product;
  selectedSize: NonNullable<Product["sizes"]>[number];
};

const CartContext = createContext<{
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  addToCart: (
    product: Product,
    selectedSize: NonNullable<Product["sizes"]>[number],
  ) => void;
} | null>(null);

function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(
    product: Product,
    selectedSize: NonNullable<Product["sizes"]>[number],
  ) {
    setCart((currentCart) => [...currentCart, { product, selectedSize }]);
  }

  return (
    <CartContext value={{ cart, setCart, addToCart }}>{children}</CartContext>
  );
}

export { CartProvider };
export default useCart;
