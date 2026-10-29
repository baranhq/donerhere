import { ui } from "../styles/ui";
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
        className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#ff5a1e] px-3 py-1.5 hover:bg-[#ffeadf] hover:text-[#9e6014] max-[760px]:gap-1 max-[760px]:px-2"
        aria-label={`Cart (${count})`}
        title="Shopping cart"
      >
        <ShoppingCart size={24} aria-hidden="true" />
        <span aria-hidden="true">{count}</span>
      </SheetTrigger>
      <SheetContent className="text-base [&_[data-slot=sheet-header]]:border-b [&_[data-slot=sheet-header]]:border-[#e5e7eb] [&_[data-slot=sheet-header]]:px-5 [&_[data-slot=sheet-header]]:py-[22px] [&_article]:gap-2.5 [&_article_img]:h-[75px] [&_article_img]:w-[65px] [&_label]:mt-2 [&_label]:flex [&_label]:items-center [&_label]:gap-2 [&_label]:text-[.85rem] [&_input]:w-15 [&_input]:rounded-[5px] [&_input]:border [&_input]:border-[#ccc] [&_input]:bg-white [&_input]:px-1.5 [&_input]:py-1 [&_article_p]:text-[.85rem] [&_article_p]:text-[#756e68] [&_[data-slot=sheet-footer]]:border-t [&_[data-slot=sheet-footer]]:border-[#e5e7eb] [&_[data-slot=sheet-close]]:rounded-md [&_[data-slot=sheet-close]]:text-[#70665f] [&_[data-slot=sheet-close]:hover]:bg-[#ffede4]">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Cart</SheetTitle>
          <SheetDescription>
            {count} {count === 1 ? "item" : "items"} in your order
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {cart.length ? (
            cart.map((item, index) => (
              <CartProduct
                key={item.product.link + item.selectedSize.link}
                {...item}
                index={index}
              />
            ))
          ) : (
            <div className="flex min-h-[55vh] flex-col items-center justify-center gap-2 text-center [&>svg]:text-[#c4aaa0] [&_h2]:text-[1.3rem] [&_h2]:font-bold [&_p]:text-[.9rem] [&_p]:text-[#80736d]">
              <ShoppingCart size={42} aria-hidden="true" />
              <h2>Your cart is empty</h2>
              <p>Add something delicious!</p>
              <button
                className={`${ui.textLink}`}
                onClick={() => goTo("/menu")}
              >
                Browse the menu
              </button>
            </div>
          )}
        </div>
        <SheetFooter>
          <div className="flex justify-between text-[1.2rem]">
            <span>Total</span>
            <strong>{money(totalCents)}</strong>
          </div>
          <button
            className={`${ui.button} mb-0 w-full gap-2`}
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
