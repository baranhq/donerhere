import { Link } from "react-router";
import { money } from "../store/site";
import type { Order } from "../store/site";

export default function OrderConfirmation({ order }: { order: Order }) {
  const delivery = order.fulfillment === "delivery";
  return (
    <main className="page order-confirmation">
      <header className="order-confirmation-heading">
        <p>DönerHere! · Order #{order.number}</p>
        <h1>Order received.</h1>
        <p>
          Thanks, {order.name}. Your order is ready for the store to review.
        </p>
      </header>
      <div className="order-receipt">
        <section className="order-receipt-items" aria-label="Order receipt">
          <h2>Your order</h2>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <span className="receipt-quantity">{item.quantity} ×</span>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.size}</span>
                </div>
                <strong>{money(item.unitCents * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="receipt-total">
            <span>Total</span>
            <strong>{money(order.totalCents)}</strong>
          </div>
          <p className="receipt-payment">{order.payment}</p>
        </section>
        <section
          className="order-receipt-details"
          aria-label="Fulfillment details"
        >
          <span className="receipt-status">Awaiting store review</span>
          <h2>{delivery ? "Delivery" : "Collection"}</h2>
          <p>
            {delivery
              ? `${order.deliveryAddress}, ${order.deliveryCity} ${order.postalCode}`
              : order.pickupLocation}
          </p>
          <p className="receipt-timing">
            Contact the store to confirm {delivery ? "delivery" : "collection"}{" "}
            timing.
          </p>
          <dl>
            <dt>Order reference</dt>
            <dd>#{order.number}</dd>
          </dl>
        </section>
      </div>
      <div className="receipt-links">
        <Link className="button" to="/account">
          View your orders
        </Link>
        <Link className="text-link" to="/menu">
          Back to the menu
        </Link>
      </div>
    </main>
  );
}
