import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";
import { useSite } from "./site";
type Line = { product: string; size: string; quantity: number };
export type CartItem = {
  product: Product;
  selectedSize: NonNullable<Product["sizes"]>[number];
  quantity: number;
};
const Context = createContext<{
  cart: CartItem[];
  addToCart: (p: Product, s: CartItem["selectedSize"]) => void;
  removeFromCart: (index: number) => void;
  setQuantity: (index: number, q: number) => void;
  clearCart: () => void;
  totalCents: number;
  count: number;
  notice: string;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  noticeId: number;
} | null>(null);
function read(): Line[] {
  try {
    const value = JSON.parse(localStorage.getItem("doner-cart-v1") || "[]");
    return Array.isArray(value)
      ? value
          .filter(
            (v) =>
              v &&
              typeof v.product === "string" &&
              typeof v.size === "string" &&
              Number.isInteger(v.quantity) &&
              v.quantity > 0 &&
              v.quantity <= 99,
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}
export function CartProvider({ children }: { children: ReactNode }) {
  const { catalog } = useSite();
  const [lines, setLines] = useState<Line[]>(read);
  const [notice, setNotice] = useState("");
  const [noticeId, setNoticeId] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const cart: CartItem[] = lines.flatMap((l) => {
    const p = catalog.products.find((p) => p.link === l.product);
    const s = p?.sizes?.find((s) => s.link === l.size);
    return p?.available && s?.available
      ? [{ product: p, selectedSize: s, quantity: l.quantity }]
      : [];
  });
  useEffect(() => {
    try {
      localStorage.setItem("doner-cart-v1", JSON.stringify(lines));
    } catch {
      setNotice(
        "Browser storage is unavailable. Keep this tab open to retain your cart.",
      );
    }
  }, [lines]);
  useEffect(() => {
    const valid = lines.filter((l) =>
      catalog.products.some(
        (p) =>
          p.link === l.product &&
          p.available &&
          p.sizes?.some((s) => s.link === l.size && s.available),
      ),
    );
    if (valid.length !== lines.length) {
      setLines(valid);
      setNotice("Unavailable items were removed from your cart.");
    }
  }, [catalog, lines]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === "doner-cart-v1") setLines(read());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function addToCart(p: Product, s: CartItem["selectedSize"]) {
    setLines((current) => {
      const found = current.find(
        (l) => l.product === p.link && l.size === s.link,
      );
      return found
        ? current.map((l) =>
            l === found ? { ...l, quantity: Math.min(99, l.quantity + 1) } : l,
          )
        : [...current, { product: p.link, size: s.link, quantity: 1 }];
    });
    setNotice(`${p.name} added to cart`);
    setNoticeId((id) => id + 1);
  }
  function setQuantity(index: number, q: number) {
    if (!Number.isInteger(q) || q < 1 || q > 99) return;
    const item = cart[index];
    setLines((current) =>
      current.map((l) =>
        l.product === item.product.link && l.size === item.selectedSize.link
          ? { ...l, quantity: q }
          : l,
      ),
    );
  }
  function removeFromCart(index: number) {
    const item = cart[index];
    setLines((current) =>
      current.filter(
        (l) =>
          l.product !== item.product.link || l.size !== item.selectedSize.link,
      ),
    );
  }
  const totalCents = cart.reduce(
    (n, i) => n + Math.round(i.selectedSize.price * 100) * i.quantity,
    0,
  );
  return (
    <Context
      value={{
        cart,
        addToCart,
        removeFromCart,
        setQuantity,
        clearCart: () => setLines([]),
        totalCents,
        count: cart.reduce((n, i) => n + i.quantity, 0),
        notice,
        noticeId,
        cartOpen,
        setCartOpen,
      }}
    >
      {children}
    </Context>
  );
}
export default function useCart() {
  const c = useContext(Context);
  if (!c) throw new Error("CartProvider is required");
  return c;
}
