import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ReceiptText } from "lucide-react";
import { api, useSite } from "../store/site";
import type { Order } from "../store/site";
import { ui } from "../styles/ui";
import OrderList from "../components/account/OrderList";
export default function Orders() {
  const { user } = useSite();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    api<Order[]>("/orders")
      .then((value) => {
        if (!cancelled) setOrders(value);
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Could not load orders",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, revision]);
  return (
    <main className={`${ui.page} max-w-[980px]!`}>
      <header className="mb-7">
        <h1>Order history</h1>
        <p className="text-stone-600">
          Your previous orders, current status and saved receipts.
        </p>
      </header>
      {!user ? (
        <section>
          <p>Sign in to see your orders.</p>
          <Link className={ui.button} to="/account">
            Sign in
          </Link>
        </section>
      ) : loading ? (
        <p role="status">Loading your orders…</p>
      ) : error ? (
        <section>
          <p role="alert" className="text-red-800">
            {error}
          </p>
          <button
            className={ui.button}
            onClick={() => setRevision((value) => value + 1)}
          >
            Try again
          </button>
        </section>
      ) : orders.length ? (
        <OrderList orders={orders} />
      ) : (
        <section className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-stone-200 bg-stone-50 p-8 text-center">
          <ReceiptText
            size={30}
            className="mb-3 text-stone-400"
            aria-hidden="true"
          />
          <h2>No orders yet</h2>
          <p className="text-stone-600">
            Your orders will appear here after checkout.
          </p>
          <Link className={ui.button} to="/menu">
            Explore the menu
          </Link>
        </section>
      )}
    </main>
  );
}
