import { Link } from "react-router";
import useCart from "../store/cart";
import CartProduct from "../components/CartProduct";
import { money } from "../store/site";
export default function Cart() {
  const { cart, totalCents, notice } = useCart();
  return (
    <main className="page">
      <h1>Your cart</h1>
      <p role="status">{notice}</p>
      {cart.length ? (
        <>
          <div className="panel">
            {cart.map((i, index) => (
              <CartProduct
                key={i.product.link + ":" + i.selectedSize.link}
                {...i}
                index={index}
              />
            ))}
            <p className="total">Total {money(totalCents)}</p>
          </div>
          <Link className="button" to="/checkout">
            Continue to checkout
          </Link>
        </>
      ) : (
        <div className="panel">
          <p>Your cart is empty. Add something delicious!</p>
          <Link className="button" to="/menu">
            Browse the menu
          </Link>
        </div>
      )}
    </main>
  );
}
