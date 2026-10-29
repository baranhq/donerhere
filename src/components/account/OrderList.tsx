import { money } from "../../store/site";
import type { Order } from "../../store/site";
export default function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div className="stack">
      {orders.length ? (
        orders.map((o) => (
          <article className="panel" key={o.id}>
            <h3>Order {o.id.slice(0, 8)}</h3>
            <p>
              {new Date(o.created).toLocaleString()} · {o.status} · {o.payment}
            </p>
            <p>
              {o.name} · {o.phone} ·{" "}
              {o.fulfillment === "delivery"
                ? `Delivery: ${o.deliveryAddress}, ${o.deliveryCity} ${o.postalCode}`
                : `Collection: ${o.pickupLocation}`}
            </p>
            <ul>
              {o.items.map((i, n) => (
                <li key={n}>
                  {i.quantity} × {i.name} ({i.size}) ·{" "}
                  {money(i.unitCents * i.quantity)}
                </li>
              ))}
            </ul>
            <strong>Total {money(o.totalCents)}</strong>
          </article>
        ))
      ) : (
        <p>No orders yet.</p>
      )}
    </div>
  );
}
