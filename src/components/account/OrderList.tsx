import { useState } from "react";
import { money } from "../../store/site";
import type { Order } from "../../store/site";

type UpdateOrder = (
  order: Order,
  status: string,
  note: string,
) => Promise<void>;
const labels: Record<string, string> = {
  received: "Received",
  ready: "Ready",
  completed: "Completed",
  declined: "Declined",
};
const date = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

function OrderCard({
  order,
  onUpdate,
}: {
  order: Order;
  onUpdate?: UpdateOrder;
}) {
  const [declining, setDeclining] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const active = ["received", "ready"].includes(order.status);
  async function update(status: string) {
    if (!onUpdate) return;
    setBusy(true);
    setError("");
    try {
      await onUpdate(order, status, note);
      setDeclining(false);
      setNote("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update order",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="order-record">
      <header>
        <div>
          <h3>Order #{order.number}</h3>
          <time dateTime={order.created}>{date(order.created)}</time>
        </div>
        <span className={`order-status status-${order.status}`}>
          {labels[order.status] || order.status}
        </span>
      </header>
      <div className="order-record-body">
        <section aria-label="Ordered items">
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <span>
                  {item.quantity} × {item.name} <small>{item.size}</small>
                </span>
                <strong>{money(item.unitCents * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-record-total">
            <span>{order.payment}</span>
            <strong>{money(order.totalCents)}</strong>
          </div>
        </section>
        <section className="order-customer" aria-label="Customer details">
          <strong>{order.name}</strong>
          <span>{order.phone}</span>
          <span>
            {order.fulfillment === "delivery"
              ? `Delivery: ${order.deliveryAddress}, ${order.deliveryCity} ${order.postalCode}`
              : `Collection: ${order.pickupLocation}`}
          </span>
        </section>
      </div>
      {onUpdate && active && (
        <div className="order-controls">
          <button
            className="button"
            disabled={busy}
            onClick={() =>
              void update(order.status === "received" ? "ready" : "completed")
            }
          >
            {busy
              ? "Updating…"
              : order.status === "received"
                ? "Mark as ready"
                : "Mark as completed"}
          </button>
          <button
            className="text-link"
            disabled={busy}
            onClick={() => setDeclining(!declining)}
          >
            Decline order
          </button>
          {declining && (
            <form
              className="order-decline"
              onSubmit={(event) => {
                event.preventDefault();
                void update("declined");
              }}
            >
              <label>
                Reason (optional, visible to customer)
                <textarea
                  maxLength={300}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                />
              </label>
              <div className="tabs">
                <button className="button danger" disabled={busy}>
                  Confirm decline
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setDeclining(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <details className="order-history">
        <summary>
          Order history · {order.history.length}{" "}
          {order.history.length === 1 ? "event" : "events"}
        </summary>
        <ol>
          {order.history.map((event, index) => (
            <li key={index}>
              <strong>{labels[event.status] || event.status}</strong>
              <time dateTime={event.at}>{date(event.at)}</time>
              {event.note && <p>{event.note}</p>}
            </li>
          ))}
        </ol>
      </details>
    </article>
  );
}
export default function OrderList({
  orders,
  onUpdate,
}: {
  orders: Order[];
  onUpdate?: UpdateOrder;
}) {
  return (
    <div className="stack">
      {orders.length ? (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdate={onUpdate} />
        ))
      ) : (
        <p className="admin-empty">No orders here yet.</p>
      )}
    </div>
  );
}
