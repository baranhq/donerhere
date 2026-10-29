import { ui } from "../styles/ui";
import { Link } from "react-router";
import useCart from "../store/cart";
import CartProduct from "../components/CartProduct";
import { money } from "../store/site";
export default function Cart() {
  const { cart, totalCents, notice } = useCart();
  return (
    <main className={`${ui.page}`}>
      <h1>Your cart</h1>
      <p role="status">{notice}</p>
      {cart.length ? (
        <>
          <div className={`${ui.panel}`}>
            {cart.map((i, index) => (
              <CartProduct
                key={i.product.link + ":" + i.selectedSize.link}
                {...i}
                index={index}
              />
            ))}
            <p className="border-t border-[#d7bfb4] pt-4 text-right text-2xl font-extrabold">
              Total {money(totalCents)}
            </p>
          </div>
          <Link className={`${ui.button}`} to="/checkout">
            Continue to checkout
          </Link>
        </>
      ) : (
        <div className={`${ui.panel}`}>
          <p>Your cart is empty. Add something delicious!</p>
          <Link className={`${ui.button}`} to="/menu">
            Browse the menu
          </Link>
        </div>
      )}
    </main>
  );
}
