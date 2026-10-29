import { ShoppingCart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "../../@/components/ui/sheet";
import useCart from "../store/cart";
import { money } from "../store/site";
import CartProduct from "./CartProduct";

export default function CartDrawer() {
  const { cart, count, totalCents, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();
  function goTo(path: string) {
    setCartOpen(false);
    navigate(path);
  }
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger
        className="cart-link"
        aria-label={`Cart (${count})`}
        title="Shopping cart"
      >
        <ShoppingCart size={24} aria-hidden="true" />
        <span aria-hidden="true">{count}</span>
      </SheetTrigger>
      <SheetContent className="cart-drawer">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Cart</SheetTitle>
          <SheetDescription>
            {count} {count === 1 ? "item" : "items"} in your order
          </SheetDescription>
        </SheetHeader>
        <div className="cart-drawer-items">
          {cart.length ? (
            cart.map((item, index) => (
              <CartProduct
                key={item.product.link + item.selectedSize.link}
                {...item}
                index={index}
              />
            ))
          ) : (
            <div className="cart-empty">
              <ShoppingCart size={42} aria-hidden="true" />
              <h2>Your cart is empty</h2>
              <p>Add something delicious!</p>
              <button className="text-link" onClick={() => goTo("/menu")}>
                Browse the menu
              </button>
            </div>
          )}
        </div>
        <SheetFooter>
          <div className="cart-drawer-total">
            <span>Total</span>
            <strong>{money(totalCents)}</strong>
          </div>
          <button
            className="button"
            disabled={!cart.length}
            onClick={() => goTo("/checkout")}
          >
            Checkout <ArrowRight size={20} aria-hidden="true" />
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
