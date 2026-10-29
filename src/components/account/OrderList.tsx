import { ui } from "../../styles/ui";
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
    <article className="overflow-hidden rounded-[10px] border border-[#e8dcd4] bg-white [&>header]:flex [&>header]:items-center [&>header]:justify-between [&>header]:gap-4 [&>header]:border-b [&>header]:border-[#eee3dc] [&>header]:bg-[#fff8f3] [&>header]:px-6 [&>header]:py-5 [&_h3]:text-[1.1rem] [&_time]:text-[.82rem] [&_time]:text-[#806d60] max-[650px]:[&>header]:px-5">
      <header>
        <div>
          <h3>Order #{order.number}</h3>
          <time dateTime={order.created}>{date(order.created)}</time>
        </div>
        <span
          className={`rounded-[5px] bg-[#f4e5d4] px-2.5 py-[5px] text-[.8rem] font-[650] text-[#80501f] ${order.status === "ready" ? "bg-[#e5f1e2]! text-[#32632c]!" : order.status === "completed" ? "bg-[#eee]! text-[#555]!" : order.status === "declined" ? "bg-[#fbe5e0]! text-[#9c3221]!" : ""}`}
        >
          {labels[order.status] || order.status}
        </span>
      </header>
      <div className="grid grid-cols-[1.3fr_1fr] gap-7 p-6 [&_li]:mb-3 [&_li]:flex [&_li]:justify-between [&_li]:gap-4 [&_small]:mt-[3px] [&_small]:block [&_small]:text-[#806d60] max-[650px]:grid-cols-1 max-[650px]:gap-5 max-[650px]:p-5">
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
          <div className="flex items-center justify-between gap-4 border-t border-[#eee3dc] pt-[15px] [&>span]:text-[.8rem] [&>span]:text-[#806d60]">
            <span>{order.payment}</span>
            <strong>{money(order.totalCents)}</strong>
          </div>
        </section>
        <section
          className="flex flex-col gap-[7px] border-l border-[#eee3dc] pl-6 text-[.9rem] max-[650px]:border-t max-[650px]:border-l-0 max-[650px]:pt-4 max-[650px]:pl-0"
          aria-label="Customer details"
        >
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
        <div className="flex flex-wrap items-center gap-4 px-6 pb-4 max-[650px]:px-5">
          <button
            className={`${ui.button}`}
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
            className={`${ui.textLink}`}
            disabled={busy}
            onClick={() => setDeclining(!declining)}
          >
            Decline order
          </button>
          {declining && (
            <form
              className="basis-full rounded-lg border border-[#ead8cc] bg-[#fff8f3] p-4"
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
              <div className="flex flex-wrap gap-3">
                <button
                  className={`${ui.button} bg-[#a82216]! hover:bg-[#881a12]!`}
                  disabled={busy}
                >
                  Confirm decline
                </button>
                <button
                  type="button"
                  className={`${ui.button} bg-[#f5e9e5]! text-[#29201c]! hover:bg-[#ead7cf]!`}
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
        <p role="alert" className="text-[#a51b12]">
          {error}
        </p>
      )}
      <details className="border-t border-[#eee3dc] px-6 py-3.5 text-[.85rem] text-[#725c4f] [&_summary]:w-fit [&_summary]:cursor-pointer [&_ol]:mt-4 [&_ol]:grid [&_ol]:gap-3.5 [&_li]:border-l-2 [&_li]:border-[#edd6c5] [&_li]:pl-3 [&_time]:mt-[3px] [&_time]:block [&_p]:my-[5px]! max-[650px]:px-5">
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
    <div className="flex flex-col gap-4">
      {orders.length ? (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdate={onUpdate} />
        ))
      ) : (
        <p className="p-6 text-center">No orders here yet.</p>
      )}
    </div>
  );
}
