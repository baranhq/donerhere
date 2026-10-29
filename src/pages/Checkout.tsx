import AuthForm from "../components/account/AuthForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../@/components/ui/dialog";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import useCart from "../store/cart";
import { api, useSite, money } from "../store/site";
import type { Order } from "../store/site";

export default function Checkout() {
  const { cart, totalCents, clearCart, setCartOpen } = useCart();
  const { user, refresh, catalog } = useSite();
  const [authOpen, setAuthOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<"delivery" | "collection">(
    "delivery",
  );
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [requestId] = useState(() => crypto.randomUUID());
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<Order>("/orders", "POST", {
        ...Object.fromEntries(new FormData(e.currentTarget)),
        requestId,
        expectedTotalCents: totalCents,
        items: cart.map((i) => ({
          product: i.product.link,
          size: i.selectedSize.link,
          quantity: i.quantity,
        })),
      });
      setOrder(result);
      clearCart();
    } catch (e) {
      setError((e as Error).message);
      await refresh().catch(() => {});
    } finally {
      setBusy(false);
    }
  }
  if (order)
    return (
      <main className="page">
        <div className="panel">
          <h1>Order received</h1>
          <p>Order reference: {order.id}</p>
          <p>
            {order.fulfillment === "delivery"
              ? `Delivery requested for ${order.deliveryAddress}, ${order.deliveryCity} ${order.postalCode}`
              : `Collection at ${order.pickupLocation}`}
          </p>
          <p>
            Total {money(order.totalCents)} · {order.payment}
          </p>
          <p>
            Your order is saved for the store to review. Contact the store to
            confirm timing.
          </p>
          <Link className="button" to="/account">
            View your orders
          </Link>
        </div>
      </main>
    );
  if (!cart.length)
    return (
      <main className="page">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link className="button" to="/menu">
          Browse menu
        </Link>
      </main>
    );
  return (
    <main className="page">
      <h1>Checkout</h1>

      <div className={user ? "two-columns" : "checkout-guest"}>
        {!user ? (
          <section className="panel checkout-signin">
            <h2>One step before your order</h2>
            <p>
              Sign in or create an account to continue. Your cart stays right
              here.
            </p>
            <Dialog open={authOpen} onOpenChange={setAuthOpen}>
              <DialogTrigger className="button">
                Sign in / register
              </DialogTrigger>
              <DialogContent className="page checkout-auth">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {register ? "Create your account" : "Welcome back"}
                  </DialogTitle>
                  <DialogDescription>
                    Sign in to finish your order.
                  </DialogDescription>
                </DialogHeader>
                <AuthForm
                  onModeChange={setRegister}
                  onSuccess={() => setAuthOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </section>
        ) : (
          <form className="panel stack" onSubmit={submit}>
            <h2>Delivery details</h2>
            <fieldset className="fulfillment-options">
              <legend>How would you like your order?</legend>
              <label>
                <input
                  type="radio"
                  name="fulfillment"
                  value="delivery"
                  checked={fulfillment === "delivery"}
                  onChange={() => setFulfillment("delivery")}
                />
                Delivery
              </label>
              <label>
                <input
                  type="radio"
                  name="fulfillment"
                  value="collection"
                  checked={fulfillment === "collection"}
                  onChange={() => setFulfillment("collection")}
                />
                Collection
              </label>
            </fieldset>
            <label>
              Name
              <input
                name="name"
                required
                maxLength={100}
                defaultValue={user.name}
                autoComplete="name"
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                type="tel"
                required
                minLength={5}
                maxLength={40}
                autoComplete="tel"
              />
            </label>
            {fulfillment === "collection" ? (
              <label>
                Collection location
                <select name="pickupLocation" required>
                  <option value="">Choose a store</option>
                  {catalog.pickupLocations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label>
                  Delivery address
                  <input
                    name="deliveryAddress"
                    required
                    maxLength={200}
                    autoComplete="street-address"
                  />
                </label>
                <label>
                  City
                  <input
                    name="deliveryCity"
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                  />
                </label>
                <label>
                  Postal code
                  <input
                    name="postalCode"
                    required
                    maxLength={30}
                    autoComplete="postal-code"
                  />
                </label>
              </>
            )}
            <p>
              No online payment is collected. The store will confirm delivery
              timing.
            </p>
            <p role="alert" className="error">
              {error}
            </p>
            <button className="button" disabled={busy}>
              {busy ? "Placing order…" : `Place order · ${money(totalCents)}`}
            </button>
          </form>
        )}
        {user && (
          <section className="panel">
            <h2>Your order</h2>
            {cart.map((i) => (
              <p key={i.product.link + i.selectedSize.link}>
                {i.quantity} × {i.product.name} · {i.selectedSize.name}{" "}
                <strong>
                  {money(Math.round(i.selectedSize.price * 100) * i.quantity)}
                </strong>
              </p>
            ))}
            <p className="total">Total {money(totalCents)}</p>
            <button className="text-link" onClick={() => setCartOpen(true)}>
              Edit cart
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
